from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session
import json
import os
import tempfile
from app.services.rag_service import (
    retrieve_context
)
from app.database import get_db

from app.models.voice_interview import VoiceInterview

from app.services.voice_service import (
    transcribe_audio
)

from app.services.interview_service import (
    generate_questions,
    evaluate_answers
)

router = APIRouter(
    prefix="/voice-interview",
    tags=["Voice Interview"]
)


# --------------------------------------------------
# Generate Voice Interview Question
# --------------------------------------------------
@router.post("/generate-question")
def generate_voice_question(
    firebase_uid: str = Form(...),
    role: str = Form(...),
    experience_level: str = Form(...),
    interview_type: str = Form(...),
):
    try:

        resume_context = retrieve_context(
            firebase_uid,
            role
        )

        result = generate_questions(
            role=role,
            experience_level=experience_level,
            interview_type=interview_type,
            resume_context=resume_context
        )

        questions = result.get("questions", [])

        return {
            "questions": questions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# --------------------------------------------------
# Upload Audio + Transcribe Only
# --------------------------------------------------
@router.post("/submit-answer")
async def submit_voice_answer(
    firebase_uid: str = Form(...),
    role: str = Form(...),
    question: str = Form(...),
    audio: UploadFile = File(...)
):
    try:

        suffix = os.path.splitext(audio.filename)[1]

        temp_file = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        )

        contents = await audio.read()

        temp_file.write(contents)
        temp_file.close()

        audio_path = temp_file.name

        transcript = transcribe_audio(
            audio_path
        )

        if os.path.exists(audio_path):
            os.remove(audio_path)

        return {
            "question": question,
            "transcript": transcript
        }

    except Exception as e:

        print(
            "TRANSCRIPTION ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# --------------------------------------------------
# Submit Complete Interview
# --------------------------------------------------
@router.post("/submit-interview")
async def submit_voice_interview(
    firebase_uid: str = Form(...),
    role: str = Form(...),
    questions: str = Form(...),
    answers: str = Form(...),
    db: Session = Depends(get_db)
):
    try:

        # Convert JSON strings to Python lists
        questions_list = json.loads(questions)
        answers_list = json.loads(answers)

        # Extract only transcripts for evaluation
        transcripts = [
            item["transcript"]
            for item in answers_list
        ]

        # ---------------------------
        # AI Evaluation
        # ---------------------------
        resume_context = retrieve_context(
        firebase_uid,
        role
       )

        evaluation = evaluate_answers(
    questions=questions_list,
    answers=transcripts,
    resume_context=resume_context
)

        print("\n===== FINAL EVALUATION =====")
        print(evaluation)
        print("============================\n")

        # ---------------------------
        # Save Interview
        # ---------------------------
        interview = VoiceInterview(
            firebase_uid=firebase_uid,
            role=role,

            # Store all questions
            question=json.dumps(
                questions_list
            ),

            # Store all answers
            transcript=json.dumps(
                answers_list
            ),

            technical_score=evaluation[
                "technical_score"
            ],

            communication_score=evaluation[
                "communication_score"
            ],

            problem_solving_score=evaluation[
                "problem_solving_score"
            ],

            overall_score=evaluation[
                "overall_score"
            ],

            overall_strengths=json.dumps(
                evaluation.get(
                    "overall_strengths",
                    []
                )
            ),

            areas_for_improvement=json.dumps(
                evaluation.get(
                    "areas_for_improvement",
                    []
                )
            ),

            recommendations=json.dumps(
                evaluation.get(
                    "recommendations",
                    []
                )
            )
        )

        db.add(interview)
        db.commit()
        db.refresh(interview)

        # ---------------------------
        # Return Final Report
        # ---------------------------
        return {

            "questions": questions_list,

            "answers": answers_list,

            "technical_score":
                evaluation[
                    "technical_score"
                ],

            "communication_score":
                evaluation[
                    "communication_score"
                ],

            "problem_solving_score":
                evaluation[
                    "problem_solving_score"
                ],

            "overall_score":
                evaluation[
                    "overall_score"
                ],

            "overall_strengths":
                evaluation.get(
                    "overall_strengths",
                    []
                ),

            "areas_for_improvement":
                evaluation.get(
                    "areas_for_improvement",
                    []
                ),

            "recommendations":
                evaluation.get(
                    "recommendations",
                    []
                )
        }

    except Exception as e:

        print(
            "FINAL INTERVIEW ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
# --------------------------------------------------
# Get Voice Interview History
# --------------------------------------------------
@router.get("/history/{firebase_uid}")
def get_voice_history(
    firebase_uid: str,
    db: Session = Depends(get_db)
):

    records = (
        db.query(VoiceInterview)
        .filter(
            VoiceInterview.firebase_uid == firebase_uid
        )
        .order_by(
            VoiceInterview.id.desc()
        )
        .all()
    )

    return [
        {
            "id": r.id,
            "role": r.role,
            "question": r.question,
            "transcript": r.transcript,

            "technical_score":
                r.technical_score,

            "communication_score":
                r.communication_score,

            "problem_solving_score":
                r.problem_solving_score,

            "overall_score":
                r.overall_score,

            "overall_strengths":
                json.loads(
                    r.overall_strengths or "[]"
                ),

            "areas_for_improvement":
                json.loads(
                    r.areas_for_improvement or "[]"
                ),

            "recommendations":
                json.loads(
                    r.recommendations or "[]"
                )
        }
        for r in records
    ]