from pydantic import BaseModel

class ProgressUpdate(BaseModel):
    user_id: str
    progress: dict