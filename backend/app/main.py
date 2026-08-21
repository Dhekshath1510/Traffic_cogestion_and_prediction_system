from fastapi import FastAPI

from app.core.config import get_settings


def create_application() -> FastAPI:
    """Create and configure the FastAPI application.

    Returns:
        Configured FastAPI application.
    """
    settings = get_settings()

    return FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI-based traffic congestion prediction system.",
        debug=settings.debug,
    )


app = create_application()
