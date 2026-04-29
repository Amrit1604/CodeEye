from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8-sig",
        extra="ignore",
    )

    database_url: str = "mysql+pymysql://codeeye:password@localhost:3306/codeeye"
    device_access_secret: str = "change-me"
    cloud_session_hours: int = 24

    groq_api_key: str = ""
    openai_api_key: str = ""

    github_client_id: str = ""
    github_client_secret: str = ""
    gitlab_client_id: str = ""
    gitlab_client_secret: str = ""

    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

    health_check_interval_hours: int = 24
    stale_project_threshold_days: int = 7

    data_encryption_key: str = ""
    raw_activity_retention_days: int = 90
    voice_transcript_retention_days: int = 180

    external_api_max_retries: int = 3
    external_api_backoff_base_ms: int = 300
    external_api_timeout_seconds: int = 10


settings = Settings()
