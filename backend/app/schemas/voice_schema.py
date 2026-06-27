from pydantic import BaseModel
from typing import List


class VoiceInterviewRequest(BaseModel):

    firebase_uid: str

    role: str

    experience_level: str = "Fresher"

    interview_type: str = "Technical"


class VoiceQuestionResponse(BaseModel):

    question: str


class VoiceEvaluationResponse(BaseModel):

    technical_score: int

    communication_score: int

    problem_solving_score: int

    overall_score: int

    overall_strengths: List[str]

    areas_for_improvement: List[str]

    recommendations: List[str]