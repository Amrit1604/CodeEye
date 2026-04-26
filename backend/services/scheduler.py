from apscheduler.schedulers.asyncio import AsyncIOScheduler

from config import settings

scheduler = AsyncIOScheduler()


def start_scheduler() -> None:
    if scheduler.running:
        return

    # TODO: Add stale project detection job.
    scheduler.add_job(lambda: None, "interval", hours=settings.health_check_interval_hours, id="health_ping")
    scheduler.start()
