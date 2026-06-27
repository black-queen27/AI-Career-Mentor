from fastapi import APIRouter,Depends
from pydantic import BaseModel
from typing import List, Dict
from app.database import engine
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.roadmap_schema import ProgressUpdate
import json

router = APIRouter()


# ----------------------------
# Request Schema
# ----------------------------
class RoadmapRequest(BaseModel):
    user_id: str
    target_role: str
    missing_skills: List[str]


# ----------------------------
# Generate Roadmap
# ----------------------------
@router.post("/generate-roadmap")
def generate_roadmap(data: RoadmapRequest):

    skills = data.missing_skills

    roadmap = {
        "Week 1": [],
        "Week 2": [],
        "Week 3": [],
        "Week 4": []
    }

    # If no missing skills
    if not skills:
        roadmap = {
            "Week 1": ["Learn programming basics"],
            "Week 2": ["Build small projects"],
            "Week 3": ["Practice coding problems"],
            "Week 4": ["Deploy a sample project"]
        }

    else:
        for i, skill in enumerate(skills):

            skill = skill.strip()

            if i % 4 == 0:
                roadmap["Week 1"].append(
                    f"Learn fundamentals of {skill}"
                )
                roadmap["Week 1"].append(
                    f"Understand basic concepts of {skill}"
                )

            elif i % 4 == 1:
                roadmap["Week 2"].append(
                    f"Hands-on practice with {skill}"
                )
                roadmap["Week 2"].append(
                    f"Build small exercises using {skill}"
                )

            elif i % 4 == 2:
                roadmap["Week 3"].append(
                    f"Advanced concepts of {skill}"
                )
                roadmap["Week 3"].append(
                    f"Work on intermediate projects in {skill}"
                )

            else:
                roadmap["Week 4"].append(
                    f"Build real-world project using {skill}"
                )
                roadmap["Week 4"].append(
                    f"Deploy project involving {skill}"
                )

    progress = {
        "Week 1": False,
        "Week 2": False,
        "Week 3": False,
        "Week 4": False
    }

    with engine.begin() as conn:

        existing = conn.execute(
            text("""
                SELECT id
                FROM user_roadmaps
                WHERE user_id = :user_id
                LIMIT 1
            """),
            {"user_id": data.user_id}
        ).fetchone()

        if existing:
            conn.execute(
                text("""
                    UPDATE user_roadmaps
                    SET target_role = :target_role,
                        roadmap = :roadmap,
                        progress = :progress
                    WHERE user_id = :user_id
                """),
                {
                    "user_id": data.user_id,
                    "target_role": data.target_role,
                    "roadmap": json.dumps(roadmap),
                    "progress": json.dumps(progress)
                }
            )

        else:
            conn.execute(
                text("""
                    INSERT INTO user_roadmaps
                    (
                        user_id,
                        target_role,
                        roadmap,
                        progress
                    )
                    VALUES
                    (
                        :user_id,
                        :target_role,
                        :roadmap,
                        :progress
                    )
                """),
                {
                    "user_id": data.user_id,
                    "target_role": data.target_role,
                    "roadmap": json.dumps(roadmap),
                    "progress": json.dumps(progress)
                }
            )

    return {
        "roadmap": roadmap,
        "progress": progress
    }


# ----------------------------
# Get Saved Roadmap
# ----------------------------
@router.get("/get-roadmap/{user_id}")
def get_roadmap(user_id: str):

    with engine.connect() as conn:

        result = conn.execute(
            text("""
                SELECT roadmap, progress
                FROM user_roadmaps
                WHERE user_id = :user_id
                ORDER BY id DESC
                LIMIT 1
            """),
            {"user_id": user_id}
        ).fetchone()

    if not result:
        return {
            "roadmap": {},
            "progress": {}
        }

    return {
        "roadmap": json.loads(result[0]),
        "progress": json.loads(result[1])
    }


# ----------------------------
# Helper
# ----------------------------
def parse_ai_output(text: str) -> Dict[str, List[str]]:

    roadmap = {
        "Week 1": [],
        "Week 2": [],
        "Week 3": [],
        "Week 4": []
    }

    current_week = None

    for line in text.split("\n"):

        line = line.strip()

        if "Week 1" in line:
            current_week = "Week 1"

        elif "Week 2" in line:
            current_week = "Week 2"

        elif "Week 3" in line:
            current_week = "Week 3"

        elif "Week 4" in line:
            current_week = "Week 4"

        elif current_week and line:
            roadmap[current_week].append(
                line.replace("-", "").strip()
            )

    return roadmap
@router.post("/roadmap/update-progress")
def update_progress(
    data: ProgressUpdate,
    db: Session = Depends(get_db)
):
    with engine.begin() as conn:

        conn.execute(
            text("""
                UPDATE user_roadmaps
                SET progress = :progress
                WHERE user_id = :user_id
            """),
            {
                "user_id": data.user_id,
                "progress": json.dumps(data.progress)
            }
        )

    return {
        "message": "Progress updated successfully"
    }