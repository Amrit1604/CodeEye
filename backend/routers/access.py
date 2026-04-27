import secrets
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter
from pydantic import BaseModel

from config import settings

router = APIRouter()


class DeviceRegistrationResponse(BaseModel):
    device_id: str
    device_secret: str
    cloud_readonly: bool = True


class CloudLoginRequest(BaseModel):
    device_id: str
    device_secret: str


class CloudLoginResponse(BaseModel):
    session_token: str
    expires_at: datetime
    scope: str = "read-only"


@router.post("/register-device", response_model=DeviceRegistrationResponse)
async def register_device() -> DeviceRegistrationResponse:
    # TODO: Persist device credentials in MySQL and hash the secret before storage.
    return DeviceRegistrationResponse(
        device_id=f"dev_{secrets.token_hex(8)}",
        device_secret=secrets.token_urlsafe(24),
    )


@router.post("/cloud-login", response_model=CloudLoginResponse)
async def cloud_login(payload: CloudLoginRequest) -> CloudLoginResponse:
    # TODO: Validate hashed secret from DB and issue signed session token.
    expires_at = datetime.now(UTC) + timedelta(hours=settings.cloud_session_hours)
    token_seed = f"{payload.device_id}:{expires_at.isoformat()}:{settings.device_access_secret}"
    return CloudLoginResponse(
        session_token=secrets.token_urlsafe(32) + "." + token_seed[:12],
        expires_at=expires_at,
    )