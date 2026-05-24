from fastapi import APIRouter

from app.schemas.auth_schema import AdminLogin

from app.controllers.auth_controller import admin_login

router = APIRouter()


@router.post("/admin/login")
def login(data: AdminLogin):
    return admin_login(data.password)
