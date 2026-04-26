from datetime import datetime

from providers.base import ActivityProvider, NormalizedActivity, NormalizedProject


class GitLabProvider(ActivityProvider):
    async def get_projects(self, credentials: dict) -> list[NormalizedProject]:
        return []

    async def get_recent_activity(self, project_id: str, credentials: dict) -> list[NormalizedActivity]:
        return []

    async def get_last_commit(self, project_id: str, credentials: dict) -> datetime | None:
        return None
