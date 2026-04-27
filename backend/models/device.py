from dataclasses import dataclass
from datetime import datetime


@dataclass
class Device:
    id: str
    device_name: str
    device_secret_hash: str
    cloud_readonly: bool
    created_at: datetime
