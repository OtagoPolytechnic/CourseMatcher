from fastapi import FastAPI
from app.course_parser import (
    extract_text,
    split_blocks,
    extract_data,
)

app = FastAPI()

@app.get("/courses/")
def parse_local_courses():
    file_path = "app/static/CourseInfo.txt" 

    full_text = extract_text(file_path)
    blocks = split_blocks(full_text)

    print("Debug: First 1000 characters of raw text:\n", full_text[:1000])
    print("Debug: No. of course blocks found:", len(blocks))

    extracted = []
    for block in blocks:
        try:
            data = extract_data(block)
            if data:
                extracted.append(data)
        except Exception as e:
            print("Error parsing  course block:", e)

    return {"courses": extracted}
