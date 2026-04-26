from fastapi import FastAPI

from routers import ai, auth, health, projects, providers

app = FastAPI(title="CodeEye API", version="0.1.0")

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(providers.router, prefix="/providers", tags=["providers"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
app.include_router(health.router, prefix="/health", tags=["health"])


@app.get("/")
async def root() -> dict:
    return {"service": "CodeEye API", "status": "ok"}
