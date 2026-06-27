from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    firebase_uid: str
    name: str
    email: EmailStr
    phone: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[str] = None
    target_role: Optional[str] = None


class UserUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[str] = None
    target_role: Optional[str] = None


class UserResponse(BaseModel):
    firebase_uid: str
    name: str
    email: EmailStr
    phone: Optional[str]
    education: Optional[str]
    experience: Optional[str]
    skills: Optional[str]
    target_role: Optional[str]

    class Config:
        from_attributes = True