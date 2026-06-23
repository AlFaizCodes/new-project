from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
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
def analyze_code(req: AnalyzeCodeRequest):
    if not req.code.strip():
        raise HTTPException(400, "Code cannot be empty")
    result = service.run_analyze_code(req.code)
    return {"status": "success", "data": result}


@router.post("/github")
def analyze_github(req: AnalyzeGithubRequest):
    if not req.url.strip():
        raise HTTPException(400, "GitHub URL cannot be empty")
    result = service.run_analyze_github(req.url)
    return {"status": "success", "data": result}


@router.post("/website")
def analyze_website(req: AnalyzeUrlRequest):
    if not req.url.strip():
        raise HTTPException(400, "URL cannot be empty")
    result = service.run_analyze_website(req.url)
    return {"status": "success", "data": result}
