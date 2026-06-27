from pydantic import BaseModel
from typing import List


class InterviewRequest(BaseModel):
    firebase_uid: str
    role: str
    experience_level: str
    interview_type: str


class InterviewResponse(BaseModel):
    questions: List[str]


class EvaluationRequest(BaseModel):
    firebase_uid: str
    questions: List[str]
    answers: List[str]


class EvaluationResponse(BaseModel):
    technical_score: int
    communication_score: int
    problem_solving_score: int
    overall_score: int

    overall_strengths: List[str]
    areas_for_improvement: List[str]
    recommendations: List[str]