from dataclasses import dataclass
from datetime import datetime


@dataclass
class CloudSession:
    id: str
    device_id: str
    access_token_hash: str
    expires_at: datetime
    created_at: datetime
