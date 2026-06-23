from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://user:pass@localhost:5432/dna_ideas"
    openai_api_key: str = ""
    product_hunt_api_key: str = ""
    github_token: str = ""
    reddit_client_id: str = ""
    reddit_client_secret: str = ""
    redis_url: str = "redis://localhost:6379/0"
    app_env: str = "development"
    cron_secret: str = ""
    embedding_model: str = "text-embedding-3-small"
    llm_model: str = "gpt-4"

    class Config:
        env_file = ".env"

settings = Settings()
