from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)

    firebase_uid = Column(String(255), nullable=False)

    filename = Column(String(255))

    extracted_text = Column(Text)

    resume_score = Column(Integer)
    target_role = Column(String(255))
    strengths = Column(Text)

    missing_skills = Column(Text)

    suggestions = Column(Text)

    ats_feedback = Column(Text)

