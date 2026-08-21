from redis.asyncio import Redis

from app.core.config import get_settings


def create_redis_client() -> Redis:
    """Create the Redis client.

    Returns:
        Configured asynchronous Redis client.
    """
    settings = get_settings()

    return Redis.from_url(
        settings.redis_url,
        decode_responses=True,
    )


redis_client = create_redis_client()


async def check_redis_connection() -> bool:
    """Check whether Redis is reachable.

    Returns:
        True when Redis responds successfully, otherwise False.
    """
    try:
        return bool(await redis_client.ping())

    except Exception:
        return False
