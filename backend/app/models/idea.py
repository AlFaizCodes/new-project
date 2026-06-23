from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from app.database import Base
from app.config import settings

USE_PGVECTOR = settings.database_url.startswith("postgresql")
if USE_PGVECTOR:
    from pgvector.sqlalchemy import Vector as PGVector
else:
    PGVector = None

def Vector(dim):
    if USE_PGVECTOR and PGVector:
        return PGVector(dim)
    return JSON

class PlatformEnum(str, enum.Enum):
    WEB = "WEB"
    MOBILE = "MOBILE"
    AI_ML = "AI_ML"
    BLOCKCHAIN = "BLOCKCHAIN"
    IOT = "IOT"
    DESKTOP = "DESKTOP"
    EXTENSION = "EXTENSION"
    API_BACKEND = "API_BACKEND"

class DifficultyEnum(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class SkillLevelEnum(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"

class ModeEnum(str, enum.Enum):
    GENERATOR = "GENERATOR"
    EVOLUTION = "EVOLUTION"
    ARCHAEOLOGY = "ARCHAEOLOGY"

class StatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    SELECTED = "SELECTED"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    name = Column(String(200), nullable=True)
    skill_level = Column(String(20), default="BEGINNER")
    budget = Column(Integer, default=0)
    team_size = Column(Integer, default=1)
    timeline = Column(String(50), default="2 weeks")
    tech_prefs = Column(JSON, default=list)
    learning_goals = Column(JSON, default=list)
    industry = Column(String(100), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    preferred_platform = Column(String(20), nullable=True)
    style_preference = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    projects = relationship("Project", back_populates="user")

class CuratedIdea(Base):
    __tablename__ = "curated_ideas"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    key_features = Column(JSON, default=list)
    platform = Column(String(20), nullable=False, index=True)
    sub_category = Column(String(100), nullable=True, index=True)
    innovation_score = Column(Integer, default=50)
    market_potential = Column(Integer, default=50)
    complexity = Column(String(10), default="MEDIUM", index=True)
    suggested_stack = Column(JSON, nullable=True)
    tags = Column(JSON, default=list)
    source = Column(String(200), nullable=True)
    trending_score = Column(Integer, default=0)
    embedding = Column(Vector(1536), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(500), default="Untitled Project")
    description = Column(Text, nullable=True)
    mode = Column(String(20), default="GENERATOR", index=True)
    status = Column(String(20), default="DRAFT", index=True)
    original_input = Column(Text, nullable=False)
    platform = Column(String(20), nullable=True, index=True)
    selected_idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=True, unique=True)
    parent_project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    embedding = Column(Vector(1536), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="projects")
    ideas = relationship("Idea", back_populates="project", foreign_keys="Idea.project_id")
    selected_idea = relationship("Idea", foreign_keys=[selected_idea_id], post_update=True)
    blueprint = relationship("Blueprint", uselist=False, back_populates="project")
    ui_mockup = relationship("UiMockup", uselist=False, back_populates="project")
    evolution_tree = Column(JSON, nullable=True)
    archaeology_report = relationship("ArchaeologyReport", uselist=False, back_populates="project")
    parent_project = relationship("Project", remote_side=[id], backref="child_projects")

class Idea(Base):
    __tablename__ = "ideas"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False, index=True)
    source = Column(String(50), nullable=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    problem_statement = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    key_features = Column(JSON, default=list)
    innovation_score = Column(Integer, default=50)
    feasibility_score = Column(Integer, default=50)
    difficulty = Column(String(10), default="MEDIUM")
    platform = Column(String(20), nullable=True, index=True)
    tags = Column(JSON, default=list)
    suggested_stack = Column(JSON, nullable=True)
    upgrade_notes = Column(JSON, nullable=True)
    selected_by = Column(Integer, ForeignKey("projects.id"), nullable=True)
    embedding = Column(Vector(1536), nullable=True)
    upvotes = Column(Integer, default=0)
    uniqueness_score = Column(Float, nullable=True)
    is_curated = Column(Boolean, default=False)
    curated_idea_id = Column(Integer, ForeignKey("curated_ideas.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="ideas", foreign_keys=[project_id])
    curated_idea = relationship("CuratedIdea")
    blueprint = relationship("Blueprint", uselist=False, back_populates="idea")
    ui_mockup = relationship("UiMockup", uselist=False, back_populates="idea")

class Blueprint(Base):
    __tablename__ = "blueprints"

    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), unique=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True, nullable=False)
    overview = Column(Text, nullable=False)
    prd = Column(JSON, nullable=False)
    tech_stack = Column(JSON, nullable=False)
    database_schema = Column(JSON, nullable=False)
    api_design = Column(JSON, nullable=False)
    user_flow = Column(JSON, nullable=False)
    implementation_plan = Column(JSON, nullable=False)
    markdown = Column(Text, nullable=True)
    openapi_spec = Column(Text, nullable=True)
    mermaid_diagrams = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    idea = relationship("Idea", back_populates="blueprint")
    project = relationship("Project", back_populates="blueprint")

class UiMockup(Base):
    __tablename__ = "ui_mockups"

    id = Column(Integer, primary_key=True, index=True)
    idea_id = Column(Integer, ForeignKey("ideas.id"), unique=True, nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True, nullable=False)
    html = Column(Text, nullable=False)
    css = Column(Text, nullable=True)
    components = Column(JSON, nullable=True)
    style_variant = Column(String(20), default="MODERN")
    mobile_notes = Column(Text, nullable=True)
    tablet_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    idea = relationship("Idea", back_populates="ui_mockup")
    project = relationship("Project", back_populates="ui_mockup")

class EnhancedIdea(Base):
    __tablename__ = "enhanced_ideas"

    id = Column(Integer, primary_key=True, index=True)
    original_idea_id = Column(Integer, ForeignKey("ideas.id"), nullable=False)
    enhanced_title = Column(String(500), nullable=True)
    enhanced_description = Column(Text, nullable=True)
    target_audience = Column(String(200), nullable=True)
    monetization = Column(Text, nullable=True)
    tech_stack = Column(JSON, nullable=True)
    market_potential = Column(String(50), nullable=True)
    difficulty = Column(String(50), nullable=True)
    unique_angle = Column(Text, nullable=True)
    competitors = Column(JSON, nullable=True)
    mvp_timeline = Column(String(100), nullable=True)
    generated_by = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    user_feedback = Column(Integer, default=0)

    original_idea = relationship("Idea", foreign_keys=[original_idea_id])

class ArchaeologyReport(Base):
    __tablename__ = "archaeology_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), unique=True, nullable=False, index=True)
    input_type = Column(String(20), nullable=False)
    input_url = Column(String(2000), nullable=True)
    input_code = Column(Text, nullable=True)
    code_analysis = Column(JSON, nullable=False)
    patterns = Column(JSON, nullable=False)
    evolution_timeline = Column(JSON, nullable=False)
    thinking_process = Column(JSON, nullable=True)
    scores = Column(JSON, nullable=False)
    future_versions = Column(JSON, nullable=False)
    detected_stack = Column(JSON, nullable=True)
    architecture_grade = Column(String(5), nullable=True)
    raw_analysis = Column(Text, nullable=True)
    embedding = Column(Vector(1536), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    project = relationship("Project", back_populates="archaeology_report")
