from pydantic import BaseModel
from typing import Optional


class ResumeResponse(BaseModel):
    id: int
    firebase_uid: str
    filename: str

    extracted_text: Optional[str]
    target_role: str | None = None
    resume_score: Optional[int]

    strengths: Optional[str]

    missing_skills: Optional[str]

    suggestions: Optional[str]
    ats_feedback: Optional[str]

    class Config:
        from_attributes = True