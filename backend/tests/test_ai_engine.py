import pytest

from services.ai_engine import build_priority


@pytest.mark.asyncio
async def test_fallback_priority_shape() -> None:
    result = await build_priority(hours=2)
    data = result.model_dump()
    assert "priority_list" in data
    assert "focus_plan" in data
    assert "critical_alerts" in data
