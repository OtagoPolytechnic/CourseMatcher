from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import sqlite3
import numpy as np
from sentence_transformers import SentenceTransformer
# from app.course_parser import (
#     extract_text,
#     split_blocks,
#     extract_data,
# )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    rows = cur.execute("""
        SELECT
          course_title, sms_code, year, credits,
          prerequisites, directed_learning_hours, workplace_learning_hours,
          self_directed_learning_hours, total_learning_hours, program, description
        FROM courses
        ORDER BY year ASC, course_title ASC
    """).fetchall()
    conn.close()

    for r in rows:
        r["prerequisites"] = json.loads(r.get("prerequisites") or "[]")

    return {"courses": rows}

@app.get("/search")
def semantic_search(q: str = Query(..., min_length=3, description="Paste course text here"),
                    k: int = Query(5, ge=1, le=50)):

    q_vec = model.encode([q], normalize_embeddings=True).astype("float32")[0]

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

    if not rows:
        return {"results": [], "note": "No embeddings found. Seeded DB missing embeddings."}

    embs = np.vstack([np.frombuffer(r["embedding"], dtype=np.float32) for r in rows])  

    sims = embs @ q_vec  

    top_idx = np.argsort(-sims)[:k]
    results = []
    for i in top_idx:
        r = rows[i]
        results.append({
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
    return {"results": results}
    
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
