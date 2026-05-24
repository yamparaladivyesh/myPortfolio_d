from pydantic import BaseModel


class SkillMatchRequest(BaseModel):
    job_description: str