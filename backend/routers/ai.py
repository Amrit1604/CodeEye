from fastapi import APIRouter

from services.ai_engine import build_priority

router = APIRouter()


@router.get("/focus")
async def get_focus_plan(hours: int = 2) -> dict:
    result = await build_priority(hours=hours)
    return result.model_dump()
