import json
import re

from groq import Groq

from app.config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def analyze_resume_with_groq(
    resume_text,
    target_role
):
    prompt = f"""
You are an AI Career Mentor.

Analyze the following resume for the target job role.

Target Job Role:
{target_role}

Compare the candidate's:
- Skills
- Projects
- Education
- Experience

against the requirements typically expected for this role.

Return ONLY valid JSON.

Do not use markdown.
Do not use ```json.

Format exactly like this:

{{
    "resume_score": 0,
    "strengths": [],
    "missing_skills": [],
    "suggestions": [],
    "ats_feedback": ""
}}

Instructions:
- resume_score must be an integer between 0 and 100.
- strengths should contain skills matching the target role.
- missing_skills should contain important skills needed for the role but absent in the resume.
- suggestions should help improve the resume for the target role.
- ats_feedback should explain ATS compatibility for this role.

Resume:

{resume_text[:6000]}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = response.choices[0].message.content.strip()

    print("\n========== GROQ RESPONSE ==========")
    print(content)
    print("===================================\n")

    try:
        return json.loads(content)

    except json.JSONDecodeError:
        content = re.sub(
            r"^```json\s*",
            "",
            content
        )

        content = re.sub(
            r"\s*```$",
            "",
            content
        )

        content = content.strip()

        return json.loads(content)