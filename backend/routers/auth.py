from fastapi import APIRouter

router = APIRouter()


@router.post("/register")
async def register() -> dict:
    return {"status": "todo"}


@router.post("/login")
async def login() -> dict:
    return {"status": "todo"}
