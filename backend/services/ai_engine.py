from pydantic import BaseModel, Field


class PriorityItem(BaseModel):
    project: str
    rank: int
    reason: str
    suggested_action: str
    estimated_minutes: int = Field(ge=5, le=240)


class PriorityResponse(BaseModel):
    priority_list: list[PriorityItem]
    focus_plan: str
    critical_alerts: list[str]


FALLBACK_RESPONSE = PriorityResponse(
    priority_list=[],
    focus_plan=(
        "AI is temporarily unavailable. Work on the project with the most recent "
        "open production issue for 30 minutes."
    ),
    critical_alerts=["AI timeout - using safe fallback plan"],
)


async def build_priority(hours: int) -> PriorityResponse:
    # TODO: Implement Groq + LangChain call with 10s timeout, validation, and retry.
    return FALLBACK_RESPONSE
