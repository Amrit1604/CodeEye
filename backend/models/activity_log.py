from dataclasses import dataclass
from datetime import datetime


@dataclass
class ActivityLog:
    id: str
    project_id: str
    event_type: str
    description: str
    happened_at: datetime
    raw_data: dict
