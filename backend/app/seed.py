# =============================================================
# File: seed.py
# Author: Navheen0508
# Project: CourseMatcher
# Description:
#   Seeds the SQLite database with course data and precomputed
#   embeddings for semantic search. Reads data from a JSON file,
#   generates embeddings using SentenceTransformer, and stores
#   both text fields and vector data into BIT.db
# =============================================================

import sqlite3
import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

# Define file paths for database and JSON course data
db_path = Path("app/data/BIT.db")
json_path = Path("app/static/courses_BIT.json")

# Ensure the database directory exists
db_path.parent.mkdir(parents=True, exist_ok=True)

# Load all course data from the JSON file
with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)["courses"]

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Drop any existing courses table to start fresh
cur.execute("DROP TABLE IF EXISTS courses")

# Create a new courses table with all required fields
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

# Load the SentenceTransformer model for generating course embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

cur.execute("DELETE FROM courses")

# Iterate through each course and insert it into the database
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

# Commit all changes and close the connection
conn.commit()
conn.close()

# Completion confirmation
print(f"Seeded courses into {db_path}")
