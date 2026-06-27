from sqlalchemy import Column, Integer, String, Text

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    firebase_uid = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    name = Column(String(100), nullable=False)

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    phone = Column(String(20))

    education = Column(Text)

    experience = Column(Text)

    skills = Column(Text)

    target_role = Column(String(100))