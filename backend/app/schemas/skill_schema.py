from pydantic import BaseModel


class SkillCreate(BaseModel):
    name: str
    category: str


class SkillReorder(BaseModel):
    id: str 
    category_order: int