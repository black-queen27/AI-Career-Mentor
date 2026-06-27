import os
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = "llama-3.3-70b-versatile"


def generate_resume(data):

    prompt = f"""
You are a professional resume writer and ATS optimization expert.

Your task is NOT to simply repeat the user's input.

Analyze the information provided and transform it into a professional,
modern, ATS-friendly resume suitable for recruiters.

Candidate Information:

Full Name:
{data.full_name}

Email:
{data.email}

Phone:
{data.phone}

Target Role:
{data.role}

Professional Summary:
{data.summary}

Skills:
{data.skills}

Education:
{data.education}

Projects:
{data.projects}

Experience:
{data.experience}

Instructions:

1. Rewrite the professional summary professionally.
2. Improve grammar and wording.
3. Convert projects into achievement-oriented bullet points.
4. Convert experience into professional resume bullet points.
5. Use strong action verbs:
   - Developed
   - Implemented
   - Designed
   - Optimized
   - Integrated
   - Built
   - Automated
   - Enhanced
6. Make the resume ATS-friendly.
7. Add measurable impact whenever possible.
8. Organize sections professionally.
9. Do not include explanations.
10. Do not say "Based on the information provided".
11.NEVER display:
   - None
   - N/A
   - null
   - Empty fields
12. Return ONLY the final resume.
13. Use this structure:

FULL NAME
Email | Phone

PROFESSIONAL SUMMARY
Write a professional summary tailored to the target role.


TECHNICAL SKILLS
• Skill 1
• Skill 2
• Skill 3



EDUCATION
Degree / Course
Institution
Relevant academic details if available



PROJECTS
Project Name
• Description
• Technologies Used
• Impact / Features



WORK EXPERIENCE
Company / Role
• Responsibilities
• Achievements
• Contributions


CERTIFICATIONS
(if available)

-

ACHIEVEMENTS
(if available)

14. Use professional formatting with proper headings as bold font. Use clear section separations.
15.  Make the resume look like a real industry-standard resume.

Return ONLY resume text.
"""

    try:

        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.6
        )

        resume_text = (
            response
            .choices[0]
            .message
            .content
            .strip()
        )

        return {
            "success": True,
            "resume": resume_text
        }

    except Exception as e:

        print("RESUME BUILDER ERROR:", e)

        return {
            "success": False,
            "resume": "",
            "message": str(e)
        }