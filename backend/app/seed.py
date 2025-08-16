import sqlite3
import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

db_path = Path("app/data/BIT.db")
json_path = Path("app/static/courses_BIT.json")

db_path.parent.mkdir(parents=True, exist_ok=True)

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)["courses"]

conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS courses")

cur.execute("""
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_title TEXT,
    sms_code TEXT,
    year INTEGER,
    credits INTEGER,
    prerequisites TEXT,
    directed_learning_hours INTEGER,
    workplace_learning_hours INTEGER,
    self_directed_learning_hours INTEGER,
    total_learning_hours INTEGER,
    program TEXT,
    description TEXT,
    embedding BLOB
)
""")

model = SentenceTransformer("all-MiniLM-L6-v2")

cur.execute("DELETE FROM courses")

for course in data:
    text = f"{course['course_title']}. {course['description']}"
    vec = model.encode([text], normalize_embeddings=True)[0]
    blob = np.asarray(vec, dtype=np.float32).tobytes()
    cur.execute("""
        INSERT INTO courses (
            course_title, sms_code, year, credits, prerequisites,
            directed_learning_hours, workplace_learning_hours,
            self_directed_learning_hours, total_learning_hours,
            program, description, embedding
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        course["course_title"],
        course["sms_code"],
        course["year"],
        course["credits"],
        json.dumps(course["prerequisites"]),  
        course["directed_learning_hours"],
        course["workplace_learning_hours"],
        course["self_directed_learning_hours"],
        course["total_learning_hours"],
        course["program"],
        course["description"],
        blob
    ))

conn.commit()
conn.close()

print(f"Seeded courses into {db_path}")
