from fastapi import APIRouter
from typing import List

from app.schemas.project_schema import (
    ProjectCreate,
    ProjectReorder
)

from app.controllers.project_controller import (
    get_projects,
    add_project,
    delete_project,
    reorder_projects,
    update_project
)

router = APIRouter()


@router.get("/projects")
def fetch_projects():
    return get_projects()


@router.post("/projects")
def create_project(project: ProjectCreate):
    return add_project(project)


@router.delete("/projects/{project_id}")
def remove_project(project_id: str):
    return delete_project(project_id)


@router.put("/projects/reorder")
def update_project_order(projects: List[ProjectReorder]):
    return reorder_projects(projects)


@router.put("/projects/{project_id}")
def edit_project(project_id: str, project: ProjectCreate):
    return update_project(project_id, project)