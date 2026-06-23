from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.idea import User
from app.schemas.idea import UserProfile, UserResponse

router = APIRouter(prefix="/api/user", tags=["user"])

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
            setattr(user, key, val)
    else:
        user = User(email="default@ideadna.app", name="Default User", **profile.dict())
        db.add(user)
    db.commit()
    db.refresh(user)
    return user
