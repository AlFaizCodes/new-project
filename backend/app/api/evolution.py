from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.evolution_service import EvolutionService
from app.schemas.idea import UserProfile
from pydantic import BaseModel
from typing import Optional, Any

router = APIRouter(prefix="/api/evolution", tags=["evolution"])
service = EvolutionService()

class CriticRequest(BaseModel):
    title: str
    description: str
    features: Optional[list[str]] = None
    user_profile: Optional[UserProfile] = None

class EvolveRequest(BaseModel):
    title: str
    description: str
    features: Optional[list[str]] = None
    critic_report: dict
    user_profile: Optional[UserProfile] = None
    count: int = 5

class GenerateRequest(BaseModel):
    title: str
    description: str
    features: Optional[list[str]] = None
    user_profile: Optional[UserProfile] = None
    count: int = 5

class ScoreRequest(BaseModel):
    evolutions: list[dict]
    user_profile: Optional[UserProfile] = None

class SelectRequest(BaseModel):
    project_id: int
    version_id: str
    version_data: dict

class FurtherRequest(BaseModel):
    project_id: int
    parent_tree_id: int
    title: str
    description: str
    features: Optional[list[str]] = None
    critic_report: dict
    user_profile: Optional[UserProfile] = None
    count: int = 5

@router.post("/critic")
def run_critic(req: CriticRequest):
    profile = req.user_profile.dict() if req.user_profile else None
    result = service.run_critic(req.title, req.description, req.features, profile)
    return {"success": True, "data": result}

@router.post("/generate")
def generate_evolutions(req: GenerateRequest):
    profile = req.user_profile.dict() if req.user_profile else None
    result = service.run_full_pipeline(req.title, req.description, req.features, profile, req.count)
    return {"success": True, "data": result}

@router.post("/evolve")
def evolve_from_critic(req: EvolveRequest):
    profile = req.user_profile.dict() if req.user_profile else None
    result = service.run_evolver(req.title, req.description, req.critic_report, req.features, profile, req.count)
    return {"success": True, "data": result}

@router.post("/score")
def score_evolutions(req: ScoreRequest):
    profile = req.user_profile.dict() if req.user_profile else None
    result = service.run_scorer(req.evolutions, profile)
    return {"success": True, "data": result}

@router.get("/tree/{project_id}")
def get_tree(project_id: int, db: Session = Depends(get_db)):
    tree = service.get_tree(db, project_id)
    if not tree:
        raise HTTPException(404, "Evolution tree not found")
    return {"status": "success", "data": tree}

@router.post("/select")
def select_version(req: SelectRequest, db: Session = Depends(get_db)):
    result = service.select_version(db, req.project_id, req.version_id, req.version_data)
    return {"success": True, "data": result}

@router.post("/further")
def evolve_further(req: FurtherRequest, db: Session = Depends(get_db)):
    profile = req.user_profile.dict() if req.user_profile else None
    result = service.evolve_further(db, req.project_id, req.parent_tree_id, req.title, req.description, req.critic_report, req.features, profile, req.count)
    return {"success": True, "data": result}
