from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    frontend_url: str = "http://localhost:3000"
    max_file_size_mb: int = 15

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
