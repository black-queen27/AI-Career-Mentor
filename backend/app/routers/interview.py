from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models.interview import InterviewSession

from app.schemas.interview_schema import (
    InterviewRequest,
    InterviewResponse,
    EvaluationRequest,
    EvaluationResponse,
)

from app.services.interview_service import (
    generate_questions,
    evaluate_answers,
)
from app.services.rag_service import (
    retrieve_context
)

router = APIRouter(
    prefix="/interview",
    tags=["Interview Preparation"]
)


@router.post(
    "/generate",
    response_model=InterviewResponse
)
def generate_interview(
    data: InterviewRequest,
    db: Session = Depends(get_db)
):
    """
    Generate AI interview questions
    using Resume RAG.
    """

    try:

        resume_context = retrieve_context(
            data.firebase_uid,
            f"{data.role} interview questions"
        )

        result = generate_questions(
            role=data.role,
            experience_level=data.experience_level,
            interview_type=data.interview_type,
            resume_context=resume_context
        )

        questions = result["questions"]

        session = InterviewSession(
            firebase_uid=data.firebase_uid,
            role=data.role,
            interview_type=data.interview_type,
            experience_level=data.experience_level,
            questions=json.dumps(questions),
            score=0
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        return {
            "questions": questions
        }

    except Exception as e:

        print(
            "INTERVIEW ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/history/{firebase_uid}")
def get_interview_history(
    firebase_uid: str,
    db: Session = Depends(get_db)
):
    """
    Return all previous interview sessions.
    """

    sessions = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.firebase_uid == firebase_uid
        )
        .order_by(
            InterviewSession.id.desc()
        )
        .all()
    )

    results = []

    for session in sessions:
        results.append({
            "id": session.id,
            "role": session.role,
            "interview_type": session.interview_type,
            "experience_level": session.experience_level,
            "questions": json.loads(session.questions),
            "score": session.score,
            "technical_score": session.technical_score,
            "communication_score": session.communication_score,
            "problem_solving_score": session.problem_solving_score,
            "overall_score": session.overall_score,
            "recommendations": json.loads(session.recommendations)
            if session.recommendations else []
        })

    return results


@router.get("/latest/{firebase_uid}")
def get_latest_interview(
    firebase_uid: str,
    db: Session = Depends(get_db)
):
    """
    Return the most recent interview session.
    """

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.firebase_uid == firebase_uid
        )
        .order_by(
            InterviewSession.id.desc()
        )
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="No interview session found."
        )

    return {
        "id": session.id,
        "role": session.role,
        "interview_type": session.interview_type,
        "experience_level": session.experience_level,
        "questions": json.loads(session.questions),
        "score": session.score,
        "technical_score": session.technical_score,
        "communication_score": session.communication_score,
        "problem_solving_score": session.problem_solving_score,
        "overall_score": session.overall_score,
        "recommendations": json.loads(session.recommendations)
        if session.recommendations else []
    }