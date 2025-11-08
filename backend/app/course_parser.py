# =============================================================
# File: course_parser.py
# Author: Navheen0508
# Project: CourseMatcher
# Description:
#   Handles LLM-based course parsing for CourseMatcher.
#   Extracts structured course fields and parses user text
#   into course objects using OpenAI GPT models
# =============================================================

from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
from typing import List, Optional
import re
import os
import json

# Load environment variables from the .env file
load_dotenv(dotenv_path=".env")

# Get and initialize OpenAI API client
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

# Function schema used for structured extraction 
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

# Open the file from the specified file path in read mode and return all text from the file
def extract_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

# Splits large text by Course Title which marks the start of each course
def split_blocks(text: str):
    return [f"**Course Title:** {block.strip()}" for block in text.split("**Course Title:**") if block.strip()]

# Prompt for telling the model which fields to extract from a course block
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
 # Send the prompt to GPT and request structured output matching the schema
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
    
# These 3 functions (extract_text, split_blocks, extract_data) handle local extraction of course data from a text document

# The code below is used to parse live user input (from the search form) into structured course data

# Define the structured output models (used to validate the LLM response)
# These can also be placed in models.py for cleaner organization

# Represents a single course object with a title and optional description
class Course(BaseModel):
    course_title: str
    description: Optional[str] = None  # description is optional

 # Holds a list of Course objects returned by the parser
class CourseList(BaseModel):
    courses: List[Course]

# Function which creates the prompt that defines how the model should interpret the text
def extract_courses_from_input(user_text: str):
    """
    Uses the LLM to parse user-provided text, which may include one or several courses.
    Extracts a structured list of {course_title, description} objects.
    This version uses OpenAI structured output parsing.
    """

    # Clean text thoroughly to avoid accidental splitting
    cleaned_text = re.sub(r"\s+", " ", user_text.strip())   # collapse multiple spaces
    cleaned_text = re.sub(r"\n+", " ", cleaned_text)        # remove all newlines

    # Prompt
    prompt = f"""
You are a strict course parser.

Your task is to identify course descriptions. The user might paste one or more.

⚠️ VERY IMPORTANT RULES:
- If the text clearly describes **only one course**, even across multiple paragraphs or sentences, return it as **ONE course only**.
- Do NOT split based on newlines, indentation, bullet points, or paragraph separation.
- Only split if there are **multiple course titles** (e.g., "Course Title:", "Machine Learning", "Data Structures").
- If there’s no explicit title, infer one short, descriptive course title.
- Never output two courses that come from a single continuous topic.

🟡 SPECIAL RULE:
- If the user provides **multiple short descriptions** (each under ~40 words) that appear to describe **different topics or skills**, treat them as **separate courses**.
- Short descriptions are often separated by punctuation, newlines, or conjunctions like "and", "also", "additionally".
- Example:
  Input: "Python basics. Data visualization."
  Output: Two courses — one for Python basics, one for Data visualization.

Return a list of objects, each containing:
- course_title
- description

Text:
{cleaned_text}
"""

    try:
        completion = client.chat.completions.parse(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a precise text-to-structure parser."},
                {"role": "user", "content": prompt}
            ],
            response_format=CourseList  # structured output type
        )

        result = completion.choices[0].message

        if result.refusal:
            print("Model refused:", result.refusal)
            return []

        parsed = result.parsed  # Already a validated CourseList instance
        return parsed.courses

    except Exception as e:
        print("Error extracting courses:", e)
        return []


