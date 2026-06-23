from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings
import os

DB_URL = settings.database_url
if DB_URL.startswith("postgresql"):
    engine = create_engine(DB_URL, pool_size=10, max_overflow=20)
else:
    engine = create_engine("sqlite:///./ideadna.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
