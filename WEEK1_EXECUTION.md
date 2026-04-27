# Week 1 Execution Checklist

## Goal
Ship a running local stack with provider abstraction enforced and baseline tests green.

## Day-by-day execution

### Day 1 - Core infrastructure
- [ ] Start services with docker compose and verify backend + db boot.
- [ ] Wire backend settings from .env.
- [ ] Add database migration tooling (Alembic) and first migration.
- [ ] Confirm MySQL container health and schema connectivity.
- [ ] Verification: GET / returns status ok.

### Day 2 - Provider abstraction contract
- [ ] Finalize ActivityProvider interface and normalized DTO shapes.
- [ ] Add unit tests that all provider adapters satisfy the contract.
- [ ] Verification: test_providers passes.

### Day 3 - GitHub provider + OAuth
- [ ] Implement GitHub OAuth connect flow and callback exchange.
- [ ] Persist encrypted access token in provider_connections.
- [ ] Implement repo and recent activity fetch.
- [ ] Verification: connect test account and fetch at least 1 repo.

### Day 4 - GitLab provider + OAuth
- [ ] Implement GitLab OAuth connect flow and callback exchange.
- [ ] Persist encrypted token and provider metadata.
- [ ] Implement project and recent activity fetch.
- [ ] Verification: connect test account and fetch at least 1 project.

### Day 5 - URL health provider + scheduler
- [ ] Add URL registration endpoint.
- [ ] Run APScheduler health ping job by interval.
- [ ] Save status_code, response_time_ms, is_healthy, error_message.
- [ ] Verification: two runs produce health_check rows.

### Day 6 - Core REST APIs
- [ ] Implement device register/cloud-login endpoints with read-only cloud sessions.
- [ ] Implement projects and providers CRUD/list endpoints.
- [ ] Add API-level tests for access/projects/providers workflows.
- [ ] Verification: pytest for access/projects/providers is green.

### Day 7 - End-to-end sanity sweep
- [ ] Run full provider sync flow for GitHub, GitLab, and URL.
- [ ] Confirm normalized activity_logs insertion.
- [ ] Confirm health_score recalculation runs after sync.
- [ ] Verification: create short screen capture of complete local flow.

## Week 1 Definition of Done
- [ ] Backend boots without manual patching.
- [ ] All three provider paths are callable end-to-end.
- [ ] Baseline test suite passes in CI/local.
- [ ] No plaintext OAuth tokens in database.
