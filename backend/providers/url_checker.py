from datetime import UTC, datetime

from providers.base import ActivityProvider, NormalizedActivity, NormalizedProject


class URLCheckerProvider(ActivityProvider):
    async def get_projects(self, credentials: dict) -> list[NormalizedProject]:
        url = credentials.get("url", "")
        if not url:
            return []
        return [
            NormalizedProject(
                provider_id=url,
                name=url,
                url=url,
                last_activity_at=None,
                open_issues_count=0,
            )
        ]

    async def get_recent_activity(self, project_id: str, credentials: dict) -> list[NormalizedActivity]:
        return [
            NormalizedActivity(
                event_type="health_check",
                description="Initial URL check scheduled",
                happened_at=datetime.now(UTC),
                project_name=project_id,
                raw_data={"project_id": project_id},
            )
        ]

    async def get_last_commit(self, project_id: str, credentials: dict) -> datetime | None:
        return None
