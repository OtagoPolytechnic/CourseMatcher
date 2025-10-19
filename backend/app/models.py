from typing import List
from pydantic import BaseModel, Field, field_validator

class Course(BaseModel):
    course_title: str
    sms_code: str
    year: int = Field(validation_alias="level")
    credits: int
    prerequisites: List[str]
    directed_learning_hours: int
    workplace_learning_hours: int
    self_directed_learning_hours: int
    total_learning_hours: int
    program: str
    description: str

    @field_validator("total_learning_hours")
    @classmethod
    def check_total(cls, v, values):
        
        if v in (None, 0):
            d = int(values.get("directed_learning_hours", 0) or 0)
            w = int(values.get("workplace_learning_hours", 0) or 0)
            s = int(values.get("self_directed_learning_hours", 0) or 0)
            return d + w + s
        return v


class CoursesEnvelope(BaseModel):
    courses: List[Course]

