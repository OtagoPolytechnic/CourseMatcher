from dotenv import load_dotenv
from openai import OpenAI
import re
import os
import json

load_dotenv(dotenv_path=".env")
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

function_schema = {
    "name": "extract_course_info",
    "description": "Extract all key course fields from a course description block.",
    "parameters": {
        "type": "object",
        "properties": {
            "course_title": {"type": "string"},
            "sms_code": {"type": "string"},
            "level": {"type": "integer"},
            "credits": {"type": "integer"},
            "prerequisites": {
                "type": "array",
                "items": {"type": "string"}
            },
            "directed_learning_hours": {"type": "integer"},
            "workplace_learning_hours": {"type": "integer"},
            "self_directed_learning_hours": {"type": "integer"},
            "total_learning_hours": {"type": "integer"},
            "description": {"type": "string"}
        },
        "required": [
            "course_title", "sms_code", "level", "credits", "prerequisites",
            "directed_learning_hours", "workplace_learning_hours",
            "self_directed_learning_hours", "total_learning_hours",
            "description"
        ]
    }
}


def extract_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def split_blocks(text: str):
    return [f"**Course Title:** {block.strip()}" for block in text.split("**Course Title:**") if block.strip()]

def extract_data(text):
    prompt = f"""
You are given a course description block. Extract ONLY the following fields:

- course_title (e.g. "Studio 1")
- sms_code (e.g. "ID750001 / IA750001")
- level (as integer)
- credits (as integer)
- prerequisites (list of strings, e.g. ["IN510"])
- directed_learning_hours (as integer)
- workplace_learning_hours (as integer)
- self_directed_learning_hours (as integer)
- total_learning_hours (as integer)
- description (as string)

If a value like prerequisites or learning hours is "n/a", "nil" or empty, handle it appropriately (e.g. "None" or 0). Make sure all fields are present.

Respond only using the function_call schema provided.

Text:
{text}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        functions=[function_schema],
        function_call={"name": "extract_course_info"}
    )

    try:
        return json.loads(response.choices[0].message.function_call.arguments)
    except Exception as e:
        print("JSON decoding failed:", e)
        print(response.choices[0].message.function_call.arguments)
        return None



