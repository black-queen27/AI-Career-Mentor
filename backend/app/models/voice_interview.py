from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Float

from app.database import Base


class VoiceInterview(Base):
    __tablename__ = "voice_interviews"

    id = Column(Integer, primary_key=True, index=True)

    firebase_uid = Column(String(255))

    role = Column(String(255))

    question = Column(Text)

    transcript = Column(Text)

    technical_score = Column(Integer)

    communication_score = Column(Integer)

    problem_solving_score = Column(Integer)

    overall_score = Column(Integer)

    overall_strengths = Column(Text)

    areas_for_improvement = Column(Text)

    recommendations = Column(Text)