# CodeEye — AI Dev Operations Brain
> Project context file for AI coding assistants (Cursor, Windsurf, Claude Code, etc.)
> Read this fully before writing any code.

---

## What we are building

CodeEye is a single-page AI-powered developer operations dashboard for solo developers.

It watches your entire developer life — Git activity, deployed app health, and voice notes — and uses an AI reasoning engine to tell you what is alive, what is dying, and exactly what to work on next.

This is NOT a todo list. There is zero manual task entry. The system collects signals automatically and reasons across all of them simultaneously.

---

## The problem it solves

Solo developers (especially CS students) juggle multiple projects, certifications, and college simultaneously. The pain points are:

1. Forgetting what to work on next across 4+ active projects
2. Projects silently dying — no commit in weeks, no one notices
3. Deployed apps going down with no alert
4. Losing thoughts and blockers mid-coding session
5. No tool connects code activity + deployment health + personal notes in one place

---

## Core features

### 1. Provider-agnostic activity tracking
Users connect one or more activity providers. The AI does not care which provider — it receives normalized data regardless of source.

**Providers for MVP:**
- GitHub (OAuth, REST API — repos, commits, open issues)
- GitLab (OAuth, REST API — same normalized output as GitHub)
- URL health check (no Git needed — user pastes any live deployment URL)

Every provider implements the same `ActivityProvider` abstract base class. This is the most important architectural decision in the project.

### 2. AI priority engine (Groq + LangChain)
Feeds all project data, activity logs, and health check results into a single Groq prompt. Returns a ranked priority list with a specific reason for each project.

Example output:
```
#1 — Jobie API: 3 open issues, no commit in 5 days, deployment response time 2.3s
#2 — InsureInfo: deployment returned 503 twice today
#3 — UConnect: healthy, last commit 2 days ago
```

### 3. Daily focus plan
Endpoint: `GET /ai/focus?hours=2`

User tells the system how many hours they have. AI returns a time-boxed plan:
```
45 min — Fix Jobie auth token expiry bug (open issue #12)
30 min — Check InsureInfo deployment logs, restart if needed
Rest — UConnect is healthy, skip today
```

### 4. Stale project detection
Background job (APScheduler) runs daily. Any project with no activity for 7+ days triggers an AI-generated re-engagement nudge with a specific 30-minute task to restart momentum. Not a generic reminder — a concrete next action.

### 5. Deployment health monitoring
The URL health check provider pings every registered URL every 24 hours (configurable). Logs:
- HTTP status code
- Response time in ms
- Consecutive failure count

Alerts appear in the AI panel when a deployment is down or slow (>2000ms).

### 6. Voice dump
User holds a record button in the UI. Audio blob is sent to backend, transcribed via OpenAI Whisper (free tier), then passed to Groq which extracts:
- Tasks mentioned
- Blockers identified
- Which project it relates to

Structured data is saved automatically. Zero typing required.

### 7. Connected AI reasoning (the crown feature)
The AI sees GitHub/GitLab activity + deployment health + voice notes simultaneously in one prompt context. It can reason across all three:

```
"InsureInfo is returning 503 errors AND you mentioned 'might be a CORS issue'
in your voice note 2 days ago AND you haven't committed in 8 days.
This is your #1 critical issue right now."
```

No other tool does this. This is the core differentiator.

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI (Python) |
| Frontend | React + Tailwind CSS (Vite) |
| AI reasoning | Groq API + LangChain (LLaMA model) |
| Voice transcription | OpenAI Whisper API (free tier) |
| Database | MySQL |
| Background jobs | APScheduler |
| Access model | Device-issued credentials + read-only cloud sessions |
| Git providers | GitHub REST API, GitLab REST API |
| Containerization | Docker + Docker Compose |
| Orchestration | Kubernetes (manifests in `/k8s` folder) |
| Deployment | Railway (backend + DB), Vercel (frontend) |
| Testing | PyTest (backend), Jest (frontend) |

---

## Folder structure

```
CodeEye/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Env vars, settings
│   ├── database.py              # MySQL connection, SQLAlchemy
│   ├── models/
│   │   ├── project.py           # Project model
│   │   ├── activity_log.py      # Activity log model
│   │   ├── health_check.py      # Health check result model
│   │   ├── device.py            # Device credential model
│   │   └── cloud_session.py     # Read-only cloud session model
│   ├── providers/
│   │   ├── base.py              # ActivityProvider abstract base class
│   │   ├── github.py            # GitHub provider implementation
│   │   ├── gitlab.py            # GitLab provider implementation
│   │   └── url_checker.py       # URL health check provider
│   ├── routers/
│   │   ├── access.py            # Device registration + cloud session endpoints
│   │   ├── projects.py          # Project CRUD endpoints
│   │   ├── providers.py         # Connect/disconnect provider endpoints
│   │   ├── ai.py                # AI focus plan, priority, voice dump endpoints
│   │   └── health.py            # Health check management endpoints
│   ├── services/
│   │   ├── ai_engine.py         # Groq + LangChain reasoning logic
│   │   ├── scheduler.py         # APScheduler jobs (stale detection, health pings)
│   │   ├── voice.py             # Whisper transcription + Groq extraction
│   │   └── normalizer.py        # Normalizes provider data to common schema
│   └── tests/
│       ├── test_providers.py
│       ├── test_ai_engine.py
│       └── test_health.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root — single page layout
│   │   ├── components/
│   │   │   ├── ProjectList.jsx  # Left panel — projects with health scores
│   │   │   ├── ActivityFeed.jsx # Middle panel — recent activity
│   │   │   ├── AIPanel.jsx      # Right panel — focus plan, priority, alerts
│   │   │   ├── VoiceDump.jsx    # Hold-to-record button + transcript display
│   │   │   └── ProviderSetup.jsx# Onboarding — connect GitHub/GitLab/URL
│   │   ├── hooks/
│   │   │   ├── useProjects.js
│   │   │   ├── useAI.js
│   │   │   └── useVoice.js
│   │   └── api/
│   │       └── client.js        # Axios instance with JWT interceptor
│   └── Dockerfile
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── docker-compose.yml
├── .env.example
└── CodeEye.md                   # This file
```

---

## Database schema

### devices
```sql
id UUID PRIMARY KEY
device_name VARCHAR NOT NULL
device_secret_hash VARCHAR NOT NULL
cloud_readonly BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT NOW()
```

### cloud_sessions
```sql
id UUID PRIMARY KEY
device_id UUID REFERENCES devices(id)
access_token_hash VARCHAR NOT NULL
expires_at TIMESTAMP NOT NULL
created_at TIMESTAMP DEFAULT NOW()
```

### projects
```sql
id UUID PRIMARY KEY
device_id UUID REFERENCES devices(id)
name VARCHAR NOT NULL
provider_type VARCHAR NOT NULL  -- 'github', 'gitlab', 'url'
provider_id VARCHAR              -- repo full_name or URL
health_score INTEGER DEFAULT 100 -- 0-100
last_activity_at TIMESTAMP
created_at TIMESTAMP DEFAULT NOW()
```

### activity_logs
```sql
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
event_type VARCHAR NOT NULL      -- 'commit', 'issue_opened', 'pr_merged', etc.
description TEXT
happened_at TIMESTAMP NOT NULL
raw_data JSON                    -- full provider response stored for debugging
```

### health_checks
```sql
id UUID PRIMARY KEY
project_id UUID REFERENCES projects(id)
checked_at TIMESTAMP DEFAULT NOW()
status_code INTEGER
response_time_ms INTEGER
is_healthy BOOLEAN
error_message TEXT
```

### provider_connections
```sql
id UUID PRIMARY KEY
device_id UUID REFERENCES devices(id)
provider_type VARCHAR NOT NULL      -- 'github', 'gitlab'
account_identifier VARCHAR NOT NULL -- github login or gitlab username/id
access_token_encrypted TEXT NOT NULL
refresh_token_encrypted TEXT
token_expires_at TIMESTAMP
scopes TEXT
created_at TIMESTAMP DEFAULT NOW()
updated_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, provider_type, account_identifier)
```

### voice_notes
```sql
id UUID PRIMARY KEY
device_id UUID REFERENCES devices(id)
project_id UUID REFERENCES projects(id)
audio_file_url TEXT
transcript TEXT NOT NULL
extracted_tasks JSON
extracted_blockers JSON
created_at TIMESTAMP DEFAULT NOW()
```

### ai_runs
```sql
id UUID PRIMARY KEY
device_id UUID REFERENCES devices(id)
request_type VARCHAR NOT NULL       -- 'priority', 'focus', 'stale_nudge', 'voice_extract'
model_name VARCHAR NOT NULL
latency_ms INTEGER
was_fallback BOOLEAN DEFAULT FALSE
error_message TEXT
created_at TIMESTAMP DEFAULT NOW()
```

---

## Provider abstraction — the most important pattern

Every provider must implement this base class. Never call GitHub/GitLab APIs directly from routers or services — always go through the provider layer.

```python
# backend/providers/base.py
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

@dataclass
class NormalizedActivity:
    event_type: str          # 'commit', 'issue', 'pr', 'health_check'
    description: str
    happened_at: datetime
    project_name: str
    raw_data: dict

@dataclass
class NormalizedProject:
    provider_id: str
    name: str
    url: str
    last_activity_at: Optional[datetime]
    open_issues_count: int

class ActivityProvider(ABC):
    @abstractmethod
    async def get_projects(self, credentials: dict) -> List[NormalizedProject]:
        """Return all projects/repos for this user"""
        pass

    @abstractmethod
    async def get_recent_activity(self, project_id: str, credentials: dict) -> List[NormalizedActivity]:
        """Return recent activity for a specific project"""
        pass

    @abstractmethod
    async def get_last_commit(self, project_id: str, credentials: dict) -> Optional[datetime]:
        """Return timestamp of most recent commit"""
        pass
```

---

## AI engine — prompt design

The AI engine receives a single context object and returns structured JSON. Always use structured output prompting with Groq.

### Response contract and reliability

The AI JSON response is not trusted until it passes schema validation.

1. Validate every AI response with Pydantic models.
2. If JSON parse fails, retry once with a strict "repair this JSON" prompt.
3. If validation still fails or total call time exceeds 10 seconds, return fallback payload.
4. Store failure metadata in `ai_runs` for debugging and prompt tuning.

Fallback payload contract:

```json
{
  "priority_list": [],
  "focus_plan": "AI is temporarily unavailable. Work on the project with the most recent open production issue for 30 minutes.",
  "critical_alerts": ["AI timeout - using safe fallback plan"]
}
```

### Priority engine prompt structure
```
System: You are CodeEye, an AI that helps solo developers decide what to work on.
You receive data about all their active projects and must return a priority-ranked
list with specific, actionable reasons. Be direct. No fluff. Output JSON only.

User context:
- Projects: [{name, last_commit, open_issues, health_score, deployment_status}]
- Available hours today: {hours}
- Recent voice notes: {transcripts}
- Health alerts: {alerts}

Return JSON:
{
  "priority_list": [
    {
      "project": "project_name",
      "rank": 1,
      "reason": "specific reason in one sentence",
      "suggested_action": "concrete next step in one sentence",
      "estimated_minutes": 45
    }
  ],
  "focus_plan": "2-3 sentence daily plan",
  "critical_alerts": ["any urgent issues"]
}
```

---

## Access pattern — desktop + cloud read portal

1. Desktop app starts and requests a new `device_id` + `device_secret` from backend.
2. Desktop app stores the secret locally and sends data to cloud using this pair.
3. User opens deployed cloud portal and logs in with `device_id` + `device_secret`.
4. Cloud portal issues read-only session token and only allows read endpoints.
5. All write operations remain desktop-side or trusted backend workflows.

---

## Key implementation rules

1. **Never call provider APIs from routers.** Routers call services. Services call providers.
2. **All provider responses go through `normalizer.py` before hitting the DB.** Raw data is stored in `raw_data JSON` for debugging but never used in AI prompts directly.
3. **AI prompts always receive normalized data, never raw API responses.** Keep prompt context clean and consistent regardless of provider.
4. **Health check scheduler runs independently from user requests.** It should not block or be blocked by API traffic.
5. **No email/password auth in MVP.** Use device-issued credentials and short-lived read-only cloud sessions.
6. **One page, three panels. No routing.** React state manages which project is selected. No React Router needed.
7. **Voice recording uses browser MediaRecorder API.** Do not use any third-party recording library.
8. **All Groq calls are async.** Never block the FastAPI event loop with synchronous LLM calls.
9. **Every endpoint that touches AI must have a timeout of 10 seconds.** If Groq is slow, return a fallback message — never hang.
10. **Environment variables only via `.env` file.** No hardcoded API keys anywhere. Ever.
11. **Provider tokens are encrypted at rest.** Never store OAuth tokens in plaintext.
12. **Use exponential backoff + jitter for all external APIs.** Apply to Groq, Whisper, GitHub, GitLab, and URL checks.
13. **Add per-provider rate-limit handling.** Respect reset windows and degrade gracefully when quota is hit.
14. **Voice transcripts and raw provider payloads have retention windows.** Default retention: 90 days for raw payloads, 180 days for transcripts.
15. **Health score must be deterministic.** Base formula combines recency, issue pressure, and deployment health and is recalculated after each sync.
16. **Cloud portal is read-only.** Any endpoint that mutates provider or project data must require trusted desktop context.
17. **Define environment targets explicitly.** Local dev (Docker Compose), staging (Railway/Vercel), optional self-hosted (Kubernetes manifests).

---

## Environment variables required

```env
# Database
DATABASE_URL=mysql+pymysql://codeeye:password@localhost:3306/codeeye

# Device access
DEVICE_ACCESS_SECRET=your-device-access-secret
CLOUD_SESSION_HOURS=24

# AI
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-key-for-whisper

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# GitLab OAuth
GITLAB_CLIENT_ID=your-gitlab-client-id
GITLAB_CLIENT_SECRET=your-gitlab-client-secret

# App
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
HEALTH_CHECK_INTERVAL_HOURS=24
STALE_PROJECT_THRESHOLD_DAYS=7

# Security
DATA_ENCRYPTION_KEY=your-32-byte-base64-key

# Data retention
RAW_ACTIVITY_RETENTION_DAYS=90
VOICE_TRANSCRIPT_RETENTION_DAYS=180

# Reliability
EXTERNAL_API_MAX_RETRIES=3
EXTERNAL_API_BACKOFF_BASE_MS=300
EXTERNAL_API_TIMEOUT_SECONDS=10
```

---

## Health score formula (MVP)

The score is 0-100 and recalculated on sync and each health check event.

- Activity recency (0-40):
  - commit <=2 days: 40
  - 3-7 days: 25
  - 8-14 days: 10
  - >14 days: 0
- Open issue pressure (0-30):
  - 0 issues: 30
  - 1-3: 20
  - 4-7: 10
  - >7: 0
- Deployment reliability (0-30):
  - healthy and <1200ms avg: 30
  - healthy and 1200-2000ms avg: 20
  - intermittent failures: 10
  - unhealthy or repeated >=500: 0

`health_score = recency + issue_pressure + deployment_reliability`

---

## What to build — week by week

### Week 1 — Foundation
- Day 1: FastAPI setup, MySQL, Docker Compose, Git repo live
- Day 2: `ActivityProvider` abstract base class — this is the backbone
- Day 3: GitHub provider implementation + OAuth
- Day 4: GitLab provider implementation + OAuth
- Day 5: URL health check provider + APScheduler pinging
- Day 6: Core REST APIs (device access, projects, providers) + PyTest
- Day 7: End-to-end test all three providers

### Week 2 — AI brain
- Day 8: Groq + LangChain integration, context builder
- Day 9: Priority engine — ranked list with reasons
- Day 10: Daily focus plan endpoint
- Day 11: Stale project detection + re-engagement nudge
- Day 12: Voice dump — Whisper transcription + Groq extraction
- Day 13: Connected reasoning — all data sources in one prompt
- Day 14: Prompt tuning with real project data

### Week 3 — Frontend
- Day 15: React + Vite + Tailwind setup, three-panel layout
- Day 16: Provider connect flow + OAuth redirect handling
- Day 17: Project health cards with color-coded scores
- Day 18: AI panel — streaming focus plan + alerts
- Day 19: Voice dump UI — hold-to-record + transcript display
- Day 20: Dark mode, loading states, error handling, mobile responsive
- Day 21: Dogfood — use CodeEye on CodeEye, fix friction

### Week 4 — DevOps and launch
- Day 22: Dockerfiles for backend and frontend
- Day 23: Kubernetes manifests in `/k8s`
- Day 24: Deploy — Railway (backend + DB), Vercel (frontend)
- Day 25: README with demo GIF, badges, setup instructions
- Day 26: 2-minute demo video recording
- Day 27: LinkedIn post + community launch
- Day 28: Bug fixes post-launch, start v2 ideas list

---

## Resume one-liner

> "Built CodeEye — a provider-agnostic AI dev operations brain that connects GitHub, GitLab, and deployment health monitoring with Groq-powered reasoning to give solo developers a real-time priority engine. Deployed via Docker and Kubernetes."

---

## What makes this different from existing tools

| Tool | What it does | What it misses |
|---|---|---|
| Linear / Jira | Task management | Manual entry, no code awareness |
| UptimeRobot | Deployment monitoring | No AI, no project context |
| Notion | Notes + tasks | No Git integration, no reasoning |
| GitHub Projects | Issue tracking | GitHub-only, no deployment health |
| **CodeEye** | **All of the above + AI reasoning across all sources** | **Nothing — this is the gap** |

---

*This file is the single source of truth for CodeEye. Update it when architecture decisions change.*
