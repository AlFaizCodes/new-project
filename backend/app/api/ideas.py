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
@router.post("/generator/full")
def generator_full(req: GeneratorFullRequest, db: Session = Depends(get_db)):
    profile = req.user_profile.dict() if req.user_profile else None
    output = service.run_generator_pipeline(db, req.input, req.platform, profile)
    return {"success": True, "data": output}

@router.post("/generator/parse")
def generator_parse(req: GeneratorFullRequest, db: Session = Depends(get_db)):
    from app.agents.input_parser import InputParserAgent
    parser = InputParserAgent()
    parsed = parser.parse(req.input)
    return {"success": True, "data": {"parsed_input": parsed}}

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

@router.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = service.get_project(db, project_id)
    if not project:
        raise HTTPException(404, "Project not found")
    db.delete(project)
    db.commit()
    return {"success": True, "message": "Project deleted"}

# ─── Ideas (for a project) ───
@router.get("/projects/{project_id}/ideas", response_model=list[IdeaCard])
def list_project_ideas(project_id: int, db: Session = Depends(get_db)):
    return service.get_project_ideas(db, project_id)

# ─── Select Idea → triggers Blueprint + Mockup (lazy-loaded) ───
@router.post("/ideas/select")
def select_idea(req: SelectIdeaRequest, project_id: int = Query(...), db: Session = Depends(get_db)):
    result = service.select_idea(db, project_id, req.idea_id)
    if not result:
        raise HTTPException(404, "Idea or project not found")
    return {"success": True, "data": result}

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
    return {"success": True, "id": idea.id}

# ─── Legacy endpoints (backward compat) ───
@router.get("/ideas", response_model=list[IdeaCard])
def list_ideas(source: str = None, category: str = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    return service.list_ideas(db, source, category, skip, limit)

@router.get("/ideas/similar", response_model=list[dict])
def similar_ideas(idea_id: int = Query(...), db: Session = Depends(get_db)):
    return service.find_similar(db, idea_id)

@router.get("/ideas/trending", response_model=list[IdeaCard])
def trending_ideas(db: Session = Depends(get_db)):
    return service.get_trending(db)

@router.post("/ideas/generate")
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

    return {"success": True, "data": {
        "original_concept": req.prompt,
        "project_id": project_id,
        **output,
    }}

@router.post("/ideas/{idea_id}/feedback")
def feedback(idea_id: int, delta: int = Query(1), db: Session = Depends(get_db)):
    idea = service.vote(db, idea_id, delta)
    if not idea:
        raise HTTPException(404)
    return {"upvotes": idea.upvotes}

@router.get("/ideas/{idea_id}", response_model=IdeaCard)
def get_idea(idea_id: int, db: Session = Depends(get_db)):
    idea = service.get_idea(db, idea_id)
    if not idea:
        raise HTTPException(404)
    return idea

@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    return {"categories": service.list_categories(db)}


# ─── Guide 5: UI Mockup Generator ───
from pydantic import BaseModel

class MockupGenerateRequest(BaseModel):
    idea_id: int
    project_id: int
    style_variant: str = "MODERN"
    screen_type: str = "landing"

class MockupComponentRequest(BaseModel):
    idea_id: int
    project_id: int
    component_type: str
    style_variant: str = "MODERN"

@router.post("/mockup/generate")
def generate_mockup(req: MockupGenerateRequest):
    from app.agents.ui_designer import UIDesignerAgent
    agent = UIDesignerAgent()
    from app.models.idea import Idea
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        idea = db.query(Idea).filter(Idea.id == req.idea_id).first()
        if not idea:
            raise HTTPException(404, "Idea not found")
        idea_data = {"id": idea.id, "title": idea.title, "description": idea.description,
                     "platform": idea.platform, "tags": idea.tags, "suggested_stack": idea.suggested_stack}
        result = agent.generate(idea_data, None, req.style_variant, req.screen_type)
        return {"success": True, "data": result}
    finally:
        db.close()

@router.post("/mockup/component")
def generate_component(req: MockupComponentRequest):
    from app.agents.ui_designer import UIDesignerAgent
    agent = UIDesignerAgent()
    from app.models.idea import Idea
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        idea = db.query(Idea).filter(Idea.id == req.idea_id).first()
        if not idea:
            raise HTTPException(404, "Idea not found")
        idea_data = {"id": idea.id, "title": idea.title, "description": idea.description}
        result = agent.generate_component(idea_data, req.component_type, req.style_variant)
        return {"success": True, "data": result}
    finally:
        db.close()

@router.get("/mockup/styles")
def list_mockup_styles():
    from app.agents.ui_designer import UIDesignerAgent
    agent = UIDesignerAgent()
    return {"styles": agent.list_style_variants(), "descriptions": agent._fallback.__globals__["STYLE_VARIANTS"]}

@router.get("/mockup/screens")
def list_mockup_screens():
    from app.agents.ui_designer import UIDesignerAgent
    agent = UIDesignerAgent()
    return {"screens": agent.list_screen_types()}


# ─── Guide 6: Innovation Scoring ───

class ScoreRequest(BaseModel):
    idea: dict
    user_profile: Optional[UserProfile] = None
    benchmarks: Optional[dict] = None

class ScoreBatchRequest(BaseModel):
    ideas: list[dict]
    user_profile: Optional[UserProfile] = None

@router.post("/score/idea")
def score_idea(req: ScoreRequest):
    from app.agents.scorer import ScorerAgent
    agent = ScorerAgent()
    profile = req.user_profile.dict() if req.user_profile else None
    result = agent.score_with_benchmark(req.idea, profile, req.benchmarks)
    return {"success": True, "data": result}

@router.post("/score/batch")
def score_ideas_batch(req: ScoreBatchRequest):
    from app.agents.scorer import ScorerAgent
    agent = ScorerAgent()
    profile = req.user_profile.dict() if req.user_profile else None
    results = agent.score_batch(req.ideas, profile)
    return {"success": True, "data": results}

@router.get("/score/benchmarks")
def get_benchmarks(platform: str = None):
    from app.database import SessionLocal
    from app.models.idea import CuratedIdea
    from sqlalchemy import func
    db = SessionLocal()
    try:
        query = db.query(
            func.avg(CuratedIdea.innovation_score).label("avg_innovation"),
            func.avg(CuratedIdea.market_potential).label("avg_market"),
            func.count(CuratedIdea.id).label("count"),
        )
        if platform:
            query = query.filter(CuratedIdea.platform == platform)
        stats = query.first()
        return {
            "success": True,
            "data": {
                "avg_innovation": round(stats.avg_innovation or 50),
                "avg_market_potential": round(stats.avg_market or 50),
                "total_ideas": stats.count or 0,
                "platform": platform or "ALL",
                "dimensions": {
                    "originality": {"avg": round(stats.avg_innovation or 50), "max": 100, "min": 10},
                    "market_potential": {"avg": round(stats.avg_market or 50), "max": 100, "min": 10},
                    "feasibility": {"avg": 65, "max": 95, "min": 20},
                    "scalability": {"avg": 55, "max": 90, "min": 15},
                    "revenue_potential": {"avg": 60, "max": 95, "min": 10},
                    "competitive_edge": {"avg": 58, "max": 92, "min": 12},
                    "complexity_match": {"avg": 65, "max": 90, "min": 25},
                    "time_to_market": {"avg": 62, "max": 95, "min": 20},
                },
            },
        }
    finally:
        db.close()
