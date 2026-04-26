from dataclasses import dataclass
from datetime import datetime


@dataclass
class VoiceNote:
    id: str
    user_id: str
    project_id: str | None
    audio_file_url: str | None
    transcript: str
    extracted_tasks: list[str]
    extracted_blockers: list[str]
    created_at: datetime
