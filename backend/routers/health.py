from fastapi import APIRouter

router = APIRouter()


@router.get("/checks")
async def list_health_checks() -> dict:
    return {"items": []}
