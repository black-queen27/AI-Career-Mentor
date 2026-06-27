from fastapi import APIRouter

from app.schemas.resume_builder_schema import (
    ResumeBuilderRequest
)

from app.services.resume_builder_service import (
    generate_resume
)

router = APIRouter(
    prefix="/resume-builder",
    tags=["Resume Builder"]
)

@router.post("/generate")
def build_resume(
    data: ResumeBuilderRequest
):
    return generate_resume(data)