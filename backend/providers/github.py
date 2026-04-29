import httpx
from datetime import datetime

from providers.base import ActivityProvider, NormalizedActivity, NormalizedProject


class GitHubProvider(ActivityProvider):
    async def get_projects(self, credentials: dict) -> list[NormalizedProject]:
        token = credentials.get("access_token")
        if not token:
            return []

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://api.github.com/user/repos",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"},
                params={"sort": "updated", "per_page": 50}
            )
            if resp.status_code != 200:
                return []

            repos = resp.json()
            projects = []
            for repo in repos:
                last_activity = None
                pushed_at = repo.get("pushed_at")
                if pushed_at:
                    last_activity = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                
                projects.append(NormalizedProject(
                    provider_id=str(repo["id"]),
                    name=repo["full_name"],
                    url=repo["html_url"],
                    last_activity_at=last_activity,
                    open_issues_count=repo.get("open_issues_count", 0)
                ))
            return projects

    async def get_recent_activity(self, project_id: str, credentials: dict) -> list[NormalizedActivity]:
        token = credentials.get("access_token")
        if not token:
            return []

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.github.com/repositories/{project_id}/events",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"},
                params={"per_page": 20}
            )
            
            if resp.status_code != 200:
                return []
                
            events = resp.json()
            activities = []
            for ev in events:
                created_at = datetime.fromisoformat(ev["created_at"].replace("Z", "+00:00"))
                activities.append(NormalizedActivity(
                    event_type=ev["type"],
                    description=f"{ev['type']} by {ev['actor']['display_login']}",
                    happened_at=created_at,
                    project_name=ev["repo"]["name"], 
                    raw_data=ev
                ))
            
            return activities

    async def get_last_commit(self, project_id: str, credentials: dict) -> datetime | None:
        token = credentials.get("access_token")
        if not token:
            return None

        async with httpx.AsyncClient() as client:
            resp = await client.get(
                f"https://api.github.com/repositories/{project_id}/commits",
                headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github.v3+json"},
                params={"per_page": 1}
            )
            
            if resp.status_code != 200:
                return None
                
            commits = resp.json()
            if not commits:
                return None
                
            commit_date = commits[0]["commit"]["committer"]["date"]
            return datetime.fromisoformat(commit_date.replace("Z", "+00:00"))

    
