from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from config import settings


def _to_async_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+aiomysql://", 1)
    if url.startswith("mysql+pymysql://"):
        return url.replace("mysql+pymysql://", "mysql+aiomysql://", 1)
    return url


engine: AsyncEngine = create_async_engine(_to_async_url(settings.database_url), echo=False, future=True)
