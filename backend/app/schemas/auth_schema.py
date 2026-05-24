from pydantic import BaseModel


class AdminLogin(BaseModel):
    password: str