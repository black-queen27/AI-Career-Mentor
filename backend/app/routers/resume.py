import os
import shutil
import uuid
import json

from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.resume import Resume
from app.models.user import User
from app.schemas.resume_schema import ResumeResponse
from app.services.parser_service import parse_resume
from app.services.analysis_service import analyze_resume
from app.services.rag_service import (
    store_resume_chunks
)
router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)

UPLOAD_DIR = "app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    firebase_uid: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    allowed_extensions = [".pdf", ".docx", ".txt"]

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOCX and TXT files are allowed."
        )

    # Fetch user profile
    user = (
        db.query(User)
        .filter(User.firebase_uid == firebase_uid)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User profile not found."
        )

    target_role = user.target_role

    if not target_role or target_role.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="Please update your Target Job Role in Profile before analyzing the resume."
        )

    # Generate unique filename
    unique_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract text from resume
        extracted_text = parse_resume(file_path)
        # Store resume for RAG

        store_resume_chunks(
    firebase_uid,
    extracted_text
    )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text extraction failed: {str(e)}"
        )

    try:
        # Analyze resume against target role
        analysis = analyze_resume(
            extracted_text,
            target_role
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )

    # Save analysis to database
    resume = Resume(
        firebase_uid=firebase_uid,
        filename=file.filename,
        extracted_text=extracted_text,
        target_role=target_role,
        resume_score=analysis["resume_score"],
        strengths=json.dumps(
            analysis["strengths"]
        ),
        missing_skills=json.dumps(
            analysis["missing_skills"]
        ),
        suggestions=json.dumps(
            analysis["suggestions"]
        ),
        ats_feedback=analysis["ats_feedback"]
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume analyzed successfully",
        "target_role": target_role,
        "resume_id": resume.id,
        "filename": resume.filename,
        "resume_score": resume.resume_score,
        "strengths": analysis["strengths"],
        "missing_skills": analysis["missing_skills"],
        "suggestions": analysis["suggestions"],
        "ats_feedback": analysis["ats_feedback"]
    }


@router.get(
    "/latest/{firebase_uid}",
    response_model=ResumeResponse
)
def get_latest_resume(
    firebase_uid: str,
    db: Session = Depends(get_db)
):
    resume = (
        db.query(Resume)
        .filter(
            Resume.firebase_uid == firebase_uid
        )
        .order_by(Resume.id.desc())
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="No resume found."
        )

    return resume


@router.get(
    "/history/{firebase_uid}",
    response_model=list[ResumeResponse]
)
def get_resume_history(
    firebase_uid: str,
    db: Session = Depends(get_db)
):
    resumes = (
        db.query(Resume)
        .filter(
            Resume.firebase_uid == firebase_uid
        )
        .order_by(Resume.id.desc())
        .all()
    )

    return resumes