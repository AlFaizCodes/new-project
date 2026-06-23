from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.idea import User, Project
from app.schemas.idea import UserProfile, UserResponse
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/user", tags=["user"])


class UserUpdateRequest(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    skill_level: Optional[str] = None
    budget: Optional[int] = None
    team_size: Optional[int] = None
    timeline: Optional[str] = None
    tech_prefs: Optional[list[str]] = None
    learning_goals: Optional[list[str]] = None
    industry: Optional[str] = None
    years_of_experience: Optional[int] = None
    preferred_platform: Optional[str] = None
    style_preference: Optional[str] = None


@router.get("/profile", response_model=UserResponse)
def get_profile(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(404, "No user found — create one via POST /api/user/profile")
    return user


@router.post("/profile", response_model=UserResponse)
def create_or_update_profile(profile: UserProfile, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if user:
        for key, val in profile.dict().items():
            if val is not None:
                setattr(user, key, val)
    else:
        user = User(email="default@ideadna.app", name="Default User", **profile.dict())
        db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/profile", response_model=UserResponse)
def patch_profile(update: UserUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(404, "No user found")
    for key, val in update.dict(exclude_none=True).items():
        setattr(user, key, val)
    db.commit()
    db.refresh(user)
    return user


@router.get("/projects")
def list_user_projects(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return {"projects": [], "total": 0}
    projects = db.query(Project).filter(Project.user_id == user.id).order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
    total = db.query(Project).filter(Project.user_id == user.id).count()
    return {
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "mode": p.mode,
                "status": p.status,
                "platform": p.platform,
                "original_input": p.original_input,
                "selected_idea_id": p.selected_idea_id,
                "created_at": p.created_at.isoformat() if p.created_at else None,
                "idea_count": len(p.ideas) if p.ideas else 0,
            }
            for p in projects
        ],
        "total": total,
    }


@router.get("/stats")
def get_user_stats(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return {"projects_total": 0, "ideas_total": 0, "avg_score": 0, "selection_rate": 0}

    projects = db.query(Project).filter(Project.user_id == user.id).all()
    ideas_count = sum(len(p.ideas) if p.ideas else 0 for p in projects)
    selected = sum(1 for p in projects if p.status == "SELECTED")
    completed = sum(1 for p in projects if p.status in ("SELECTED", "COMPLETED"))

    return {
        "projects_total": len(projects),
        "ideas_total": ideas_count,
        "avg_score": 72,
        "selection_rate": round(completed / len(projects) * 100) if projects else 0,
    }
