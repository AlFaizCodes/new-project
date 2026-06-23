from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.ideas import router as ideas_router
from app.api.fetch import router as fetch_router
from app.api.users import router as users_router
from app.api.evolution import router as evolution_router
from app.api.archaeology import router as archaeology_router
from app.api.export_api import router as export_router
from app.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IdeaDNA API",
    description="AI-Powered Idea Generation & Enhancement Platform",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ideas_router)
app.include_router(fetch_router)
app.include_router(users_router)
app.include_router(evolution_router)
app.include_router(archaeology_router)
app.include_router(export_router)

@app.get("/health")
def health():
    return {"status": "healthy", "version": "2.0.0"}
