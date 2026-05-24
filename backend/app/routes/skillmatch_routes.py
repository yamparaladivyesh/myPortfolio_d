from fastapi import APIRouter

from app.schemas.skillmatch_schema import SkillMatchRequest

from app.controllers.skillmatch_controller import skill_match

router = APIRouter()


@router.post("/skillmatch")
def match_skills(data: SkillMatchRequest):
    return skill_match(data.job_description)