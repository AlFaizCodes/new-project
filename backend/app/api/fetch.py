from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.fetchers import fetch_all, get_fetcher
from app.services.idea_service import IdeaService
from app.config import settings

router = APIRouter(prefix="/api", tags=["fetch"])
service = IdeaService()

@router.post("/cron/fetch-all")
async def fetch_all_sources(
    cron_secret: str = Header(None),
    db: Session = Depends(get_db),
):
    if settings.app_env != "development" and cron_secret != settings.cron_secret:
        raise HTTPException(403, "Invalid secret")
    ideas = await fetch_all()
    count = 0
    for idea_data in ideas:
        existing = db.query(type(service).__module__).filter_by(
            source=idea_data.get("source"),
            source_id=idea_data.get("source_id", ""),
        ).first()
        if not existing:
            service.create_idea(db, idea_data)
            count += 1
    return {"status": "success", "fetched": len(ideas), "new": count}

@router.post("/cron/fetch/{source}")
async def fetch_source(source: str, db: Session = Depends(get_db)):
    fetcher = get_fetcher(source)
    if not fetcher:
        raise HTTPException(404, f"Unknown source: {source}")
    ideas = await fetcher.fetch()
    count = 0
    for idea_data in ideas:
        idea_data["source"] = source
        service.create_idea(db, idea_data)
        count += 1
    return {"status": "success", "source": source, "fetched": count}
