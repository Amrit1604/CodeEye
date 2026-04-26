from dataclasses import dataclass
from datetime import datetime


@dataclass
class AIRun:
    id: str
    user_id: str
    request_type: str
    model_name: str
    latency_ms: int | None
    was_fallback: bool
    error_message: str | None
    created_at: datetime
