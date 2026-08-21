from fastapi import FastAPI
from loguru import logger
from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging


def create_application() -> FastAPI:
    """Create and configure the FastAPI application.

    Returns:
        Configured FastAPI application.
    """
    settings = get_settings()

    configure_logging(settings.log_level)

    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="AI-based traffic congestion prediction system.",
        debug=settings.debug,
        # lifespan=application_lifespan,
    )

    application.include_router(api_router)

    logger.info(
        "Application initialized: {} v{}",
        settings.app_name,
        settings.app_version,
    )

    return application


app = create_application()
