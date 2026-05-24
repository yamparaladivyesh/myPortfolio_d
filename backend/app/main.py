from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.skill_routes import router as skill_router
from app.routes.project_routes import router as project_router
from app.routes.auth_routes import router as auth_router
from app.routes.skillmatch_routes import router as skillmatch_router

app = FastAPI()

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES

app.include_router(skill_router, prefix="/api")

app.include_router(project_router, prefix="/api")

app.include_router(auth_router, prefix="/api")

app.include_router(skillmatch_router, prefix="/api")


# HOME ROUTE

@app.get("/")
def home():
    return {
        "message": "Backend connected successfully"
    }