from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from routers import access, ai, health, projects, providers

app = FastAPI(title="CodeEye API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(access.router, prefix="/access", tags=["access"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(providers.router, prefix="/providers", tags=["providers"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(health.router, prefix="/health", tags=["health"])


@app.get("/")
async def root() -> dict:
    return {"service": "CodeEye API", "status": "ok"}
