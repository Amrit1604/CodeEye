from dataclasses import dataclass
from datetime import datetime


@dataclass
class ProviderConnection:
    id: str
    user_id: str
    provider_type: str
    account_identifier: str
    access_token_encrypted: str
    refresh_token_encrypted: str | None
    token_expires_at: datetime | None
    scopes: str | None
    created_at: datetime
    updated_at: datetime
