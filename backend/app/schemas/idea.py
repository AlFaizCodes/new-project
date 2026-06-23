from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

# ─── User ───
class UserProfile(BaseModel):
    skill_level: str = "BEGINNER"
    budget: int = 0
    team_size: int = 1
    timeline: str = "2 weeks"
    tech_prefs: list[str] = []
    industry: Optional[str] = None
    preferred_platform: Optional[str] = None
    style_preference: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    skill_level: str
    budget: int
    team_size: int
    timeline: str
    tech_prefs: list[str]
    industry: Optional[str] = None

    class Config:
        from_attributes = True

# ─── CuratedIdea ───
class CuratedIdeaResponse(BaseModel):
    id: int
    title: str
    description: str
    problem_statement: str
    solution: str
    key_features: list[str]
    platform: str
    sub_category: Optional[str] = None
    innovation_score: int
    market_potential: int
    complexity: str
    suggested_stack: Optional[Any] = None
    tags: list[str]
    source: Optional[str] = None
    trending_score: int

    class Config:
        from_attributes = True

# ─── Project ───
class ProjectCreate(BaseModel):
    title: Optional[str] = "Untitled Project"
    mode: str = "GENERATOR"
    original_input: str
    platform: Optional[str] = None
    description: Optional[str] = None

class ProjectResponse(BaseModel):
    id: int
    title: str
    mode: str
    status: str
    original_input: str
    platform: Optional[str] = None
    selected_idea_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Idea (enhanced/upgraded result) ───
class IdeaCard(BaseModel):
    id: int
    project_id: int
    title: str
    description: Optional[str] = None
    problem_statement: Optional[str] = None
    solution: Optional[str] = None
    key_features: list[str] = []
    innovation_score: int = 50
    feasibility_score: int = 50
    difficulty: str = "MEDIUM"
    platform: Optional[str] = None
    tags: list[str] = []
    suggested_stack: Optional[Any] = None
    is_curated: bool = False
    curated_idea_id: Optional[int] = None

    class Config:
        from_attributes = True

# ─── Blueprint ───
class BlueprintResponse(BaseModel):
    id: int
    idea_id: int
    overview: str
    prd: Any
    tech_stack: Any
    database_schema: Any
    api_design: Any
    user_flow: Any
    implementation_plan: Any
    markdown: Optional[str] = None
    openapi_spec: Optional[str] = None
    mermaid_diagrams: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ─── UiMockup ───
class UiMockupResponse(BaseModel):
    id: int
    idea_id: int
    html: str
    css: Optional[str] = None
    style_variant: str
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Generator Pipeline ───
class GenerateRequest(BaseModel):
    project_id: Optional[int] = None
    prompt: str
    platform: Optional[str] = None
    category: Optional[str] = None
    count: int = 5
    user_profile: Optional[UserProfile] = None

class GenerateResponse(BaseModel):
    status: str
    data: dict

class GeneratorFullRequest(BaseModel):
    input: str
    platform: Optional[str] = None
    user_profile: Optional[UserProfile] = None

class GeneratorFullResponse(BaseModel):
    status: str
    data: dict

# ─── Select / Deep Dive ───
class SelectIdeaRequest(BaseModel):
    idea_id: int

class SelectIdeaResponse(BaseModel):
    status: str
    data: dict

# ─── Curated Endpoints ───
class CuratedSubmitRequest(BaseModel):
    title: str
    description: str
    problem_statement: str
    solution: str
    key_features: list[str]
    platform: str
    sub_category: Optional[str] = None
    innovation_score: int
    market_potential: int
    complexity: str
    suggested_stack: Optional[Any] = None
    tags: list[str] = []
    source: Optional[str] = None
