from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import sqlite3
import numpy as np
import os
from sentence_transformers import SentenceTransformer
from app.course_parser import extract_courses_from_input

app = FastAPI()

# ✅ Explicitly allow both localhost and 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "app/data/BIT.db"
model = SentenceTransformer("all-MiniLM-L6-v2")


def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


@app.get("/courses/")
def get_courses():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()
    rows = cur.execute(
        """
        SELECT
            course_title, sms_code, year, credits,
            prerequisites, directed_learning_hours, workplace_learning_hours,
            self_directed_learning_hours, total_learning_hours, program, description
        FROM courses
        ORDER BY year ASC, course_title ASC
    """
    ).fetchall()
    conn.close()

    for r in rows:
        r["prerequisites"] = json.loads(r.get("prerequisites") or "[]")

    return {"courses": rows}


# ✅ Handle both `/search` and `/search/`
@app.get("/search")
@app.get("/search/")
def hybrid_semantic_search(
    q: str = Query(..., min_length=3, description="Paste one or more course descriptions"),
    k: int = Query(5, ge=1, le=50),
):
    # Extract course entries
    try:
        parsed_courses = extract_courses_from_input(q)
    except Exception as e:
        return {"error": f"Parser failed: {e}"}

    if not parsed_courses:
        parsed_courses = [{"course_title": q, "description": q}]  # fallback

    # Load stored courses + embeddings
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        rows = cur.execute("""
            SELECT
              course_title, sms_code, year, credits, prerequisites,
              directed_learning_hours, workplace_learning_hours,
              self_directed_learning_hours, total_learning_hours,
              program, description, embedding
            FROM courses
            WHERE embedding IS NOT NULL
        """).fetchall()
        conn.close()
    except Exception as e:
        return {"error": f"Database error: {e}"}

    if not rows:
        return {"results": [], "note": "No embeddings found in database."}

    try:
        embs = np.vstack([np.frombuffer(r["embedding"], dtype=np.float32) for r in rows])
    except Exception as e:
        return {"error": f"Embedding decode failed: {e}"}

    # Search for each parsed course
    results_all = {}

    for course in parsed_courses:
        title = course["course_title"] if isinstance(course, dict) else getattr(course, "course_title", "Unknown Course")
        desc = course["description"] if isinstance(course, dict) else getattr(course, "description", "")
        query_text = f"{title}. {desc}"

        try:
            q_vec = model.encode([query_text], normalize_embeddings=True).astype("float32")[0]
        except Exception as e:
            return {"error": f"Encoding failed for '{title}': {e}"}

        sims = embs @ q_vec
        top_idx = np.argsort(-sims)[:k]

        matches = []
        for i in top_idx:
            r = rows[i]
            matches.append({
                "course_title": r["course_title"],
                "sms_code": r["sms_code"],
                "year": r["year"],
                "credits": r["credits"],
                "prerequisites": json.loads(r["prerequisites"] or "[]"),
                "directed_learning_hours": r["directed_learning_hours"],
                "workplace_learning_hours": r["workplace_learning_hours"],
                "self_directed_learning_hours": r["self_directed_learning_hours"],
                "total_learning_hours": r["total_learning_hours"],
                "program": r["program"],
                "description": r["description"],
                "similarity": float(sims[i]),
            })

        results_all[title] = matches

    # Build output titles for frontend
    # Get distinct program names
    programs = list({r["program"] for r in rows if r["program"]})
    general_title = programs[0] + " Courses" if programs else "Courses"

    # Use the first parsed title for “Matches for:”
    first_title = (
        parsed_courses[0]["course_title"]
        if isinstance(parsed_courses[0], dict)
        else getattr(parsed_courses[0], "course_title", q)
    )

    # Build top matches summary (3 best from the first course)
    first_course_matches = next(iter(results_all.values()), [])
    top_matches = ", ".join([m["course_title"] for m in first_course_matches[:3]]) if first_course_matches else "No matches found"

    return {
        "query": q,
        "general_title": general_title,
        "matches_for": first_title,
        "top_matches": top_matches,
        "parsed_courses": parsed_courses,
        "results": results_all,
    }


# def parse_local_courses():
#     file_path = "app/static/CourseInfo.txt"

#     full_text = extract_text(file_path)
#     blocks = split_blocks(full_text)

#     print("Debug: First 1000 characters of raw text:\n", full_text[:1000])
#     print("Debug: No. of course blocks found:", len(blocks))

#     extracted = []
#     for block in blocks:
#         try:
#             data = extract_data(block)
#             if data:
#                 extracted.append(data)
#         except Exception as e:
#             print("Error parsing  course block:", e)

#     return {"courses": extracted}
