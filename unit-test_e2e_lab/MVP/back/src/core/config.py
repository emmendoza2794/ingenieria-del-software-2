import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # Database Configuration
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/mvp_base"

    # Application Settings
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")

    # JWT Configuration
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "case_sensitive": True}


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
