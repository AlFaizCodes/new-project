from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.archaeology_service import ArchaeologyService

router = APIRouter(prefix="/api/archaeology", tags=["archaeology"])
service = ArchaeologyService()


class AnalyzeCodeRequest(BaseModel):
    code: str


class AnalyzeUrlRequest(BaseModel):
    url: str


class AnalyzeGithubRequest(BaseModel):
    url: str


@router.post("/code")
def analyze_code(req: AnalyzeCodeRequest, project_id: int = Query(None), db: Session = Depends(get_db)):
    if not req.code.strip():
        raise HTTPException(400, "Code cannot be empty")
    result = service.run_analyze_code(req.code, project_id, db)
    return {"success": True, "data": result}


@router.post("/github")
def analyze_github(req: AnalyzeGithubRequest, project_id: int = Query(None), db: Session = Depends(get_db)):
    if not req.url.strip():
        raise HTTPException(400, "GitHub URL cannot be empty")
    result = service.run_analyze_github(req.url, project_id, db)
    return {"success": True, "data": result}


@router.post("/website")
def analyze_website(req: AnalyzeUrlRequest, project_id: int = Query(None), db: Session = Depends(get_db)):
    if not req.url.strip():
        raise HTTPException(400, "URL cannot be empty")
    result = service.run_analyze_website(req.url, project_id, db)
    return {"success": True, "data": result}


@router.get("/report/{project_id}")
def get_archaeology_report(project_id: int, db: Session = Depends(get_db)):
    from app.models.idea import ArchaeologyReport
    report = db.query(ArchaeologyReport).filter(ArchaeologyReport.project_id == project_id).first()
    if not report:
        raise HTTPException(404, "Archaeology report not found")
    return {"success": True, "data": {
        "id": report.id,
        "project_id": report.project_id,
        "input_type": report.input_type,
        "input_url": report.input_url,
        "code_analysis": report.code_analysis or {},
        "patterns": report.patterns or {},
        "evolution_timeline": report.evolution_timeline or {},
        "scores": report.scores or {},
        "future_versions": report.future_versions or {},
        "detected_stack": report.detected_stack or {},
        "architecture_grade": report.architecture_grade or "B",
        "created_at": report.created_at.isoformat() if report.created_at else None,
    }}
