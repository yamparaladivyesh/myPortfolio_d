from pydantic import BaseModel


class ProjectCreate(BaseModel):
    title: str
    technologies: str
    description: str
    features: str
    githubLink: str
    liveLink: str


class ProjectReorder(BaseModel):
    id: str
    order: int