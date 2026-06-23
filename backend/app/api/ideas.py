from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.idea import (
    GeneratorFullRequest, GeneratorFullResponse,
    GenerateRequest, GenerateResponse,
    SelectIdeaRequest, SelectIdeaResponse,
    ProjectCreate, ProjectResponse,
    IdeaCard, BlueprintResponse, UiMockupResponse,
    CuratedIdeaResponse, CuratedSubmitRequest,
    UserProfile, UserResponse,
)
from app.services.idea_service import IdeaService
from app.models.idea import User

router = APIRouter(prefix="/api", tags=["ideas"])
service = IdeaService()

# ─── Generator Full Pipeline ───
@router.post("/generator/full", response_model=GeneratorFullResponse)
def generator_full(req: GeneratorFullRequest, db: Session = Depends(get_db)):
    profile = req.user_profile.dict() if req.user_profile else None
    output = service.run_generator_pipeline(db, req.input, req.platform, profile)
    return GeneratorFullResponse(status="success", data=output)

@router.post("/generator/parse", response_model=GeneratorFullResponse)
def generator_parse(req: GeneratorFullRequest, db: Session = Depends(get_db)):
    from app.agents.input_parser import InputParserAgent
    parser = InputParserAgent()
    parsed = parser.parse(req.input)
    return GeneratorFullResponse(status="success", data={"parsed_input": parsed})

# ─── Projects ───
@router.post("/projects", response_model=ProjectResponse)
def create_project(req: ProjectCreate, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        raise HTTPException(400, "No user found — create a user first")
    project = service.create_project(db, user.id, req.title, req.mode, req.original_input, req.platform, req.description)
    return project

@router.get("/projects", response_model=list[ProjectResponse])
def list_projects(skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        return []
    return service.list_projects(db, user.id, skip, limit)

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = service.get_project(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    return project

# ─── Ideas (for a project) ───
@router.get("/projects/{project_id}/ideas", response_model=list[IdeaCard])
def list_project_ideas(project_id: int, db: Session = Depends(get_db)):
    return service.get_project_ideas(db, project_id)

# ─── Select Idea → triggers Blueprint + Mockup (lazy-loaded) ───
@router.post("/ideas/select", response_model=SelectIdeaResponse)
def select_idea(req: SelectIdeaRequest, project_id: int = Query(...), db: Session = Depends(get_db)):
    result = service.select_idea(db, project_id, req.idea_id)
    if not result:
        raise HTTPException(404, "Idea or project not found")
    return SelectIdeaResponse(status="success", data=result)

# ─── Blueprint (lazy-loaded) ───
@router.get("/ideas/{idea_id}/blueprint", response_model=BlueprintResponse)
def get_blueprint(idea_id: int, db: Session = Depends(get_db)):
    bp = service.get_blueprint(db, idea_id)
    if not bp:
        raise HTTPException(404, "Blueprint not found — select the idea first")
    return bp

# ─── UI Mockup (lazy-loaded) ───
@router.get("/ideas/{idea_id}/mockup", response_model=UiMockupResponse)
def get_mockup(idea_id: int, db: Session = Depends(get_db)):
    mu = service.get_mockup(db, idea_id)
    if not mu:
        raise HTTPException(404, "Mockup not found — select the idea first")
    return mu

# ─── Curated Ideas ───
@router.get("/curated", response_model=list[CuratedIdeaResponse])
def list_curated(platform: str = None, complexity: str = None, skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return service.list_curated(db, platform, complexity, skip, limit)

@router.get("/curated/platforms", response_model=list[str])
def curated_platforms(db: Session = Depends(get_db)):
    return service.get_curated_platforms(db)

@router.get("/curated/trending", response_model=list[CuratedIdeaResponse])
def curated_trending(platform: str = None, limit: int = 10, db: Session = Depends(get_db)):
    return service.get_curated_trending(db, platform, limit)

@router.post("/curated/submit")
def submit_curated(req: CuratedSubmitRequest, db: Session = Depends(get_db)):
    from app.models.idea import CuratedIdea
    idea = CuratedIdea(**req.dict())
    db.add(idea)
    db.commit()
    db.refresh(idea)
    return {"status": "success", "id": idea.id}

# ─── Legacy endpoints (backward compat) ───
@router.get("/ideas", response_model=list[IdeaCard])
def list_ideas(source: str = None, category: str = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return service.list_ideas(db, source, category, skip, limit)

@router.get("/ideas/{idea_id}", response_model=IdeaCard)
def get_idea(idea_id: int, db: Session = Depends(get_db)):
    idea = service.get_idea(db, idea_id)
    if not idea:
        raise HTTPException(404)
    return idea

@router.post("/ideas/generate", response_model=GenerateResponse)
def generate_ideas(req: GenerateRequest, db: Session = Depends(get_db)):
    profile = req.user_profile.dict() if req.user_profile else {}
    output = service.run_generator_pipeline(db, req.prompt, req.platform, profile)

    # Create project + save ideas
    user = db.query(User).first()
    if user:
        project = service.create_project(db, user.id, req.prompt[:50], "GENERATOR", req.prompt, req.platform)
        saved = service.save_generated_ideas(db, project.id, output.get("cards", []))
        project_id = project.id
    else:
        project_id = None

    return GenerateResponse(status="success", data={
        "original_concept": req.prompt,
        "project_id": project_id,
        **output,
    })

@router.get("/ideas/similar", response_model=list[dict])
def similar_ideas(idea_id: int = Query(...), db: Session = Depends(get_db)):
    return service.find_similar(db, idea_id)

@router.get("/ideas/trending", response_model=list[IdeaCard])
def trending_ideas(db: Session = Depends(get_db)):
    return service.get_trending(db)

@router.post("/ideas/{idea_id}/feedback")
def feedback(idea_id: int, delta: int = Query(1), db: Session = Depends(get_db)):
    idea = service.vote(db, idea_id, delta)
    if not idea:
        raise HTTPException(404)
    return {"upvotes": idea.upvotes}

@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    return {"categories": service.list_categories(db)}
