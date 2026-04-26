import pytest

from providers.url_checker import URLCheckerProvider


@pytest.mark.asyncio
async def test_url_checker_returns_project() -> None:
    provider = URLCheckerProvider()
    projects = await provider.get_projects({"url": "https://example.com"})
    assert len(projects) == 1
