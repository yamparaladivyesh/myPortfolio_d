from fastapi import APIRouter
from typing import List

from app.schemas.skill_schema import (
    SkillCreate,
    SkillReorder
)

from app.controllers.skill_controller import (
    get_skills,
    add_skill,
    delete_skill,
    reorder_skills
)

router = APIRouter()


@router.get("/skills")
def fetch_skills():
    return get_skills()


@router.post("/skills")
def create_skill(skill: SkillCreate):
    return add_skill(skill)


@router.delete("/skills/{skill_id}")
def remove_skill(skill_id: str):
    return delete_skill(skill_id)


@router.put("/skills/reorder")
def update_skill_order(skills: List[SkillReorder]):
    return reorder_skills(skills)