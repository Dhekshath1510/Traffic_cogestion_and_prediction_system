from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_name: str = Field(
        default="Traffic Congestion Prediction API",
        description="Application name.",
    )

    app_version: str = Field(
        default="0.1.0",
        description="Application version.",
    )

    environment: str = Field(
        default="development",
        description="Application environment.",
    )

    debug: bool = Field(
        default=False,
        description="Enable debug mode.",
    )

    database_url: str = Field(
        default="",
        description="PostgreSQL database connection URL.",
    )

    redis_url: str = Field(
        default="",
        description="Redis connection URL.",
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return the cached application settings.

    Returns:
        Application settings instance.
    """
    settings = Settings()

    if not settings.database_url:
        raise ValueError("DATABASE_URL is not configured.")

    if not settings.redis_url:
        raise ValueError("REDIS_URL is not configured.")

    return settings