from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
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

@app.get("/courses/")

def get_courses():
    file_path = "app/static/courses_BIT.json"  
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            courses_data = json.load(f)
        return {"courses": courses_data["courses"] if "courses" in courses_data else courses_data}
    except FileNotFoundError:
        return {"error": f"File not found: {file_path}"}
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON format in {file_path}: {str(e)}"}
    
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
