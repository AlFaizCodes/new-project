from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import PlainTextResponse, HTMLResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.export_service import ExportService

router = APIRouter(prefix="/api/export", tags=["export"])
service = ExportService()


@router.get("/blueprint/{idea_id}/markdown")
def export_blueprint_markdown(idea_id: int, db: Session = Depends(get_db)):
    md = service.export_blueprint_markdown(db, idea_id)
    if not md:
        raise HTTPException(404, "Blueprint not found")
    return PlainTextResponse(md, media_type="text/markdown")


@router.get("/blueprint/{idea_id}/json")
def export_blueprint_json(idea_id: int, db: Session = Depends(get_db)):
    data = service.export_blueprint_json(db, idea_id)
    if not data:
        raise HTTPException(404, "Blueprint not found")
    return {"success": True, "data": data}


@router.get("/mockup/{idea_id}/html")
def export_mockup_html(idea_id: int, db: Session = Depends(get_db)):
    html = service.export_mockup_html(db, idea_id)
    if not html:
        raise HTTPException(404, "UI Mockup not found")
    return HTMLResponse(html)
