from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    frontend_url: str = "http://localhost:3000"
    max_file_size_mb: int = 15

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        origins = [o.strip() for o in self.frontend_url.split(",") if o.strip()]
        # always include the Vercel deployment
        vercel = "https://reto-tecnico-python.vercel.app"
        if vercel not in origins:
            origins.append(vercel)
        return origins


settings = Settings()
