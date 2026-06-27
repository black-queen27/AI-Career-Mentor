from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.users import router as user_router

# Import models so SQLAlchemy creates tables
from app.models.user import User
from app.routers.resume import router as resume_router
from app.routers.roadmap import router as roadmap_router
from app.routers.interview import router as interview_router
from app.routers import voice_interview
from app.models.voice_interview import VoiceInterview
from app.routers import resume_builder
app = FastAPI(
    title="AI Career Mentor API",
    description="Module 1 - User Management APIs",
    version="1.0.0"
)
app.include_router(roadmap_router)
# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Allow React frontend
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test Route
@app.get("/")
def home():
    return {
        "message": "AI Career Mentor Backend Running"
    }


# Register Routers
app.include_router(user_router)
app.include_router(resume_router)
app.include_router(roadmap_router)
app.include_router(interview_router)
app.include_router(voice_interview.router)
app.include_router(resume_builder.router)