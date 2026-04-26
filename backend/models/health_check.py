from dataclasses import dataclass
from datetime import datetime


@dataclass
class HealthCheck:
    id: str
    project_id: str
    checked_at: datetime
    status_code: int | None
    response_time_ms: int | None
    is_healthy: bool
    error_message: str | None
