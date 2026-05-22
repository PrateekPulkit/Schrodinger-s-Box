from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "super_secret_dev_key"
    DATABASE_URL: str = "sqlite:///./db/schrodinger.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"

settings = Settings()
