from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_providers() -> dict:
    return {"providers": ["github", "gitlab", "url"]}
