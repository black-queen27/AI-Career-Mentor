from app.services.groq_service import analyze_resume_with_groq

def analyze_resume(resume_text, target_role):
    return analyze_resume_with_groq(
        resume_text,
        target_role
    )