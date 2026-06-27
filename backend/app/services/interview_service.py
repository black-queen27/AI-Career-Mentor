import os
import json
from groq import Groq

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

MODEL = "llama-3.3-70b-versatile"


# ==================================================
# Generate Interview Questions
# ==================================================
def generate_questions(
    role: str,
    experience_level: str,
    interview_type: str,
    resume_context: str = ""
):

    prompt = f"""
You are an expert interviewer.

Generate EXACTLY 5 interview questions.

Role: {role}
Experience Level: {experience_level}
Interview Type: {interview_type}
Candidate Resume Context:
{resume_context}
Rules:
- Questions must match the role.
- Questions must match the experience level.
- Use the candidate's resume context.
- Ask about projects mentioned in the resume.
- Ask about skills mentioned in the resume.
- Ask about internships and experiences.
- At least 3 of the 5 questions must be based on the resume context.
- If resume context is empty, generate normal role-based questions.
- HR interviews focus on communication and workplace situations.
- Behavioral interviews focus on STAR scenarios.
- Mixed interviews contain both technical and HR questions.
Technical interviews should focus on explaining concepts verbally.

IMPORTANT FOR VOICE INTERVIEWS:

- Do NOT ask the candidate to write code.
- Do NOT ask for program outputs.
- Do NOT ask coding syntax questions.

Instead ask:

- Explain concepts.
- Explain architecture.
- Explain debugging approaches.
- Explain project experiences.
- Explain API design.
- Explain database concepts.
- Explain problem-solving strategies.

Examples:

GOOD:
- Explain the difference between React state and props.
- How would you optimize a slow SQL query?
- Explain the lifecycle of an API request.
- Describe a project where you used FastAPI.
- How does JWT authentication work?

BAD:
- Write a Python program to reverse a string.
- Write SQL to find duplicates.
- Implement binary search.
- Write React code for a counter.

Return ONLY valid JSON.

{{
  "questions": [
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}}
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
            temperature=0.7
        )

        content = response.choices[0].message.content.strip()

        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1:
            content = content[start:end + 1]

        result = json.loads(content)

        return result

    except Exception as e:

        print("QUESTION GENERATION ERROR:", e)

        return {
            "questions": [
                f"Explain your experience with {role}.",
                f"What are important concepts in {role}?",
                f"Describe a project related to {role}.",
                f"What challenges have you faced in {role}?",
                f"Why do you want to work as a {role}?"
            ]
        }


# ==================================================
# Evaluate Interview Answers
# ==================================================
def evaluate_answers(
    questions,
    answers,
    resume_context=""
):

    prompt = f"""
You are a senior AI interview evaluator.

Questions:
{json.dumps(questions)}

Answers:
{json.dumps(answers)}

Resume Context:
{resume_context}

Consider:
- Technical knowledge across all answers
- Communication consistency
- Ability to explain projects mentioned in the resume
- Ability to explain technologies listed in the resume
- Consistency between answers and resume
- Problem solving ability
- Confidence
- Role-specific skills

Return ONE final report.
Evaluate ALL answers together.
1. Technical Accuracy
2. Communication Skills
3. Problem Solving Ability

IMPORTANT:
- Scores MUST be on a 0-100 scale.
- Never return 7, 8, 9 as final scores.
- Return values like 70, 80, 90.
- Example:
  Technical Score: 78
  Communication Score: 84
  Problem Solving Score: 73

For voice interviews:

- Do NOT penalize candidates for not writing code.
- Evaluate based on conceptual understanding.
- Evaluate explanation quality, communication, reasoning, confidence, and technical knowledge.
- A candidate can receive high scores without providing code.

Return ONLY JSON.

{{
    "technical_score": 0,
    "communication_score": 0,
    "problem_solving_score": 0,
    "overall_score": 0,

    "overall_strengths": [
        "...",
        "...",
        "..."
    ],

    "areas_for_improvement": [
        "...",
        "...",
        "..."
    ],

    "recommendations": [
        "...",
        "...",
        "..."
    ]
}}
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

        content = response.choices[0].message.content.strip()

        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1:
            content = content[start:end + 1]

        result = json.loads(content)

        return {
            "technical_score": int(result.get("technical_score", 70)),
            "communication_score": int(result.get("communication_score", 70)),
            "problem_solving_score": int(result.get("problem_solving_score", 70)),
            "overall_score": int(result.get("overall_score", 70)),
            "overall_strengths": result.get("overall_strengths", []),
            "areas_for_improvement": result.get("areas_for_improvement", []),
            "recommendations": result.get("recommendations", [])
        }

    except Exception as e:

        print("EVALUATION ERROR:", e)

        return {
            "technical_score": 70,
            "communication_score": 70,
            "problem_solving_score": 70,
            "overall_score": 70,
            "overall_strengths": [
                "Good effort",
                "Basic understanding shown",
                "Attempted all questions"
            ],
            "areas_for_improvement": [
                "Add more technical depth",
                "Use structured answers",
                "Give practical examples"
            ],
            "recommendations": [
                "Practice mock interviews",
                "Review role-specific concepts",
                "Improve communication"
            ]
        }