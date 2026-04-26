from providers.base import NormalizedActivity, NormalizedProject


def normalize_projects(projects: list[NormalizedProject]) -> list[dict]:
    return [
        {
            "provider_id": p.provider_id,
            "name": p.name,
            "url": p.url,
            "last_activity_at": p.last_activity_at,
            "open_issues_count": p.open_issues_count,
        }
        for p in projects
    ]


def normalize_activity(activity: list[NormalizedActivity]) -> list[dict]:
    return [
        {
            "event_type": a.event_type,
            "description": a.description,
            "happened_at": a.happened_at,
            "project_name": a.project_name,
            "raw_data": a.raw_data,
        }
        for a in activity
    ]
