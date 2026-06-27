from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import (
    UserCreate,
    UserUpdate,
    UserResponse,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# Register User Profile
@router.post("", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if Firebase UID already exists
    existing_user = (
        db.query(User)
        .filter(User.firebase_uid == user.firebase_uid)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    db_user = User(
        firebase_uid=user.firebase_uid,
        name=user.name,
        email=user.email,
        phone=user.phone,
        education=user.education,
        experience=user.experience,
        skills=user.skills,
        target_role=user.target_role,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# Get User Profile
@router.get(
    "/{firebase_uid}",
    response_model=UserResponse
)
def get_user(
    firebase_uid: str,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# Update User Profile
@router.put(
    "/{firebase_uid}",
    response_model=UserResponse
)
def update_user(
    firebase_uid: str,
    updated_user: UserUpdate,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.name = updated_user.name
    user.email = updated_user.email
    user.phone = updated_user.phone
    user.education = updated_user.education
    user.experience = updated_user.experience
    user.skills = updated_user.skills
    user.target_role = updated_user.target_role

    db.commit()
    db.refresh(user)

    return user