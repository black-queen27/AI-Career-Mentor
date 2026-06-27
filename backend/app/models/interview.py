from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(Integer, primary_key=True, index=True)

    firebase_uid = Column(String(255), nullable=False)

    role = Column(String(255), nullable=False)

    interview_type = Column(String(255), nullable=False)

    experience_level = Column(String(255), nullable=False)

    questions = Column(Text, nullable=False)

    score = Column(Integer, default=0)

    technical_score = Column(Integer, default=0)

    communication_score = Column(Integer, default=0)

    problem_solving_score = Column(Integer, default=0)

    overall_score = Column(Integer, default=0)

    recommendations = Column(Text, nullable=True)