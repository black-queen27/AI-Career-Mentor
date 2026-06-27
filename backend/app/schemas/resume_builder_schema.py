from pydantic import BaseModel

class ResumeBuilderRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    role: str
    summary: str
    skills: str
    education: str
    projects: str
    experience: str