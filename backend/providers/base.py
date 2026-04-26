from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class NormalizedActivity:
    event_type: str
    description: str
    happened_at: datetime
    project_name: str
    raw_data: dict


@dataclass
class NormalizedProject:
    provider_id: str
    name: str
    url: str
    last_activity_at: Optional[datetime]
    open_issues_count: int


class ActivityProvider(ABC):
    @abstractmethod
    async def get_projects(self, credentials: dict) -> list[NormalizedProject]:
        raise NotImplementedError

    @abstractmethod
    async def get_recent_activity(self, project_id: str, credentials: dict) -> list[NormalizedActivity]:
        raise NotImplementedError

    @abstractmethod
    async def get_last_commit(self, project_id: str, credentials: dict) -> Optional[datetime]:
        raise NotImplementedError
