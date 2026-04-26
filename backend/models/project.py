from dataclasses import dataclass
from datetime import datetime


@dataclass
class Project:
    id: str
    user_id: str
    name: str
    provider_type: str
    provider_id: str
    health_score: int
    last_activity_at: datetime | None
    created_at: datetime
