from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import sqlite3
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
