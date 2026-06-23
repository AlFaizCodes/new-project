from sqlalchemy.orm import Session
from sqlalchemy import desc, text
from app.models.idea import Idea, Project, Blueprint, UiMockup, CuratedIdea
from app.schemas.idea import UserProfile
from app.agents.input_parser import InputParserAgent
from app.agents.retriever import RetrieverAgent
from app.agents.ranker import RankerAgent
from app.agents.upgrade import UpgradeAgent
from app.agents.scorer import ScorerAgent
from app.agents.output_formatter import OutputFormatterAgent
from app.agents.blueprint_architect import BlueprintArchitectAgent
from app.agents.ui_designer import UIDesignerAgent
from app.agents.embedding import EmbeddingGenerator

input_parser = InputParserAgent()
retriever = RetrieverAgent()
ranker = RankerAgent()
upgrade = UpgradeAgent()
scorer = ScorerAgent()
formatter = OutputFormatterAgent()
blueprint_architect = BlueprintArchitectAgent()
ui_designer = UIDesignerAgent()
embedder = EmbeddingGenerator()

class IdeaService:

    # ─── Generator Pipeline ───
    def run_generator_pipeline(self, db: Session, raw_input: str, platform: str = None, user_profile: dict = None) -> dict:
        if user_profile is None:
            user_profile = {"skill_level": "BEGINNER", "budget": 0, "team_size": 1, "timeline": "2 weeks", "tech_prefs": []}

        # Step 1: Parse input
        parsed = input_parser.parse(raw_input)
        detected_platform = parsed.get("platform", platform or "WEB")

        # Step 2: Retrieve from curated DB
        retrieved = retriever.retrieve(
            db, raw_input,
            platform=detected_platform if detected_platform != "ALL" else None,
            skill_level=user_profile.get("skill_level", "BEGINNER"),
            budget=user_profile.get("budget", 0),
            limit=10,
        )

        # Step 3: Rank by user profile
        ranked = ranker.rank(retrieved, **user_profile) if retrieved else []
        top_ideas = ranked[:5]

        # Step 4: Upgrade each with AI
        upgraded = []
        for curated in top_ideas:
            result = upgrade.upgrade(curated, user_profile)
            result["platform"] = detected_platform
            result["is_curated"] = True
            result["curated_idea_id"] = curated.get("id")
            result["source"] = curated.get("source")
            upgraded.append(result)

        # Step 5: Score each
        scored = scorer.score_batch(upgraded, user_profile)

        # Step 6: Format output
        cards = formatter.format_cards(upgraded, scored)
        output = formatter.format_pipeline_output(parsed, len(retrieved), cards)

        return output

    def save_generated_ideas(self, db: Session, project_id: int, cards: list[dict]) -> list[Idea]:
        saved = []
        for card in cards:
            idea = Idea(
                project_id=project_id,
                source="curated",
                title=card.get("title", "Untitled"),
                description=card.get("description", ""),
                problem_statement=card.get("problem_statement", ""),
                solution=card.get("solution", ""),
                key_features=card.get("key_features", []),
                innovation_score=card.get("innovation_score", 50),
                feasibility_score=card.get("feasibility_score", 50),
                difficulty=card.get("difficulty", "MEDIUM"),
                platform=card.get("platform"),
                tags=card.get("tags", []),
                suggested_stack=card.get("suggested_stack"),
                is_curated=card.get("is_curated", False),
                curated_idea_id=card.get("curated_idea_id"),
                embedding=embedder.generate(card.get("title", "") + " " + card.get("description", "")),
            )
            db.add(idea)
            db.flush()
            card["id"] = idea.id
            saved.append(idea)
        db.commit()
        for idea in saved:
            db.refresh(idea)
        return saved

    # ─── Select Idea → Triggers Lazy Blueprint + Mockup ───
    def select_idea(self, db: Session, project_id: int, idea_id: int, user_profile: dict = None) -> dict:
        project = db.query(Project).filter(Project.id == project_id).first()
        idea = db.query(Idea).filter(Idea.id == idea_id, Idea.project_id == project_id).first()
        if not project or not idea:
            return None

        project.selected_idea_id = idea_id
        project.status = "SELECTED"
        db.commit()

        idea_data = {
            "id": idea.id,
            "title": idea.title,
            "description": idea.description,
            "problem_statement": idea.problem_statement,
            "solution": idea.solution,
            "key_features": idea.key_features,
            "innovation_score": idea.innovation_score,
            "feasibility_score": idea.feasibility_score,
            "difficulty": idea.difficulty,
            "platform": idea.platform,
            "tags": idea.tags,
            "suggested_stack": idea.suggested_stack,
        }

        blueprint_data = blueprint_architect.generate(idea_data, user_profile or {})
        mockup_data = ui_designer.generate(idea_data, blueprint_data)

        bp = Blueprint(
            idea_id=idea_id,
            project_id=project_id,
            overview=blueprint_data.get("overview", ""),
            prd=blueprint_data.get("prd", {}),
            tech_stack=blueprint_data.get("tech_stack", {}),
            database_schema=blueprint_data.get("database_schema", {}),
            api_design=blueprint_data.get("api_design", {}),
            user_flow=blueprint_data.get("user_flow", []),
            implementation_plan=blueprint_data.get("implementation_plan", {}),
            markdown=None,
            openapi_spec=None,
            mermaid_diagrams=None,
        )
        db.add(bp)

        mu = UiMockup(
            idea_id=idea_id,
            project_id=project_id,
            html=mockup_data.get("html", ""),
            css=mockup_data.get("css"),
            components=mockup_data.get("components"),
            style_variant=mockup_data.get("style_variant", "MODERN"),
        )
        db.add(mu)
        db.commit()

        return {"blueprint": blueprint_data, "mockup": mockup_data}

    # ─── Project CRUD ───
    def create_project(self, db: Session, user_id: int, title: str, mode: str, original_input: str, platform: str = None, description: str = None) -> Project:
        project = Project(
            user_id=user_id,
            title=title or "Untitled Project",
            mode=mode,
            original_input=original_input,
            platform=platform,
            description=description,
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

    def list_projects(self, db: Session, user_id: int, skip: int = 0, limit: int = 20) -> list[Project]:
        return db.query(Project).filter(Project.user_id == user_id).order_by(desc(Project.created_at)).offset(skip).limit(limit).all()

    def get_project(self, db: Session, project_id: int) -> Project:
        return db.query(Project).filter(Project.id == project_id).first()

    # ─── Curated Ideas ───
    def list_curated(self, db: Session, platform: str = None, complexity: str = None, skip: int = 0, limit: int = 50) -> list[CuratedIdea]:
        query = db.query(CuratedIdea)
        if platform:
            query = query.filter(CuratedIdea.platform == platform)
        if complexity:
            query = query.filter(CuratedIdea.complexity == complexity)
        return query.order_by(desc(CuratedIdea.innovation_score)).offset(skip).limit(limit).all()

    def get_curated_platforms(self, db: Session) -> list[str]:
        results = db.query(CuratedIdea.platform).distinct().all()
        return sorted([r[0] for r in results if r[0]])

    def get_curated_trending(self, db: Session, platform: str = None, limit: int = 10) -> list[CuratedIdea]:
        query = db.query(CuratedIdea).order_by(desc(CuratedIdea.trending_score), desc(CuratedIdea.innovation_score))
        if platform:
            query = query.filter(CuratedIdea.platform == platform)
        return query.limit(limit).all()

    # ─── Blueprint & Mockup ───
    def get_blueprint(self, db: Session, idea_id: int) -> Blueprint:
        return db.query(Blueprint).filter(Blueprint.idea_id == idea_id).first()

    def get_mockup(self, db: Session, idea_id: int) -> UiMockup:
        return db.query(UiMockup).filter(UiMockup.idea_id == idea_id).first()

    # ─── Ideas list for project ───
    def get_project_ideas(self, db: Session, project_id: int) -> list[Idea]:
        return db.query(Idea).filter(Idea.project_id == project_id).order_by(desc(Idea.innovation_score)).all()

    # ─── List ideas (for backward compat) ───
    def list_ideas(self, db: Session, source: str = None, category: str = None, skip: int = 0, limit: int = 20):
        query = db.query(Idea)
        if source:
            query = query.filter(Idea.source == source)
        if category:
            query = query.filter(Idea.platform == category)
        return query.order_by(desc(Idea.innovation_score)).offset(skip).limit(limit).all()

    def get_idea(self, db: Session, idea_id: int):
        return db.query(Idea).filter(Idea.id == idea_id).first()

    def find_similar(self, db: Session, idea_id: int, limit: int = 5):
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
        if not idea or not idea.embedding:
            return []
        emb = idea.embedding
        query = """
            SELECT id, title, description, platform, innovation_score, feasibility_score,
                   difficulty, tags, 1 - (embedding <=> :embedding::vector) as similarity
            FROM ideas
            WHERE id != :idea_id AND embedding IS NOT NULL
            ORDER BY similarity DESC
            LIMIT :limit
        """
        results = db.execute(text(query), {"embedding": str(emb), "idea_id": idea_id, "limit": limit}).fetchall()
        return [dict(r._mapping) for r in results]

    def vote(self, db: Session, idea_id: int, delta: int = 1):
        idea = db.query(Idea).filter(Idea.id == idea_id).first()
        if idea:
            idea.upvotes = (idea.upvotes or 0) + delta
            db.commit()
        return idea

    def get_trending(self, db: Session, limit: int = 10):
        return db.query(Idea).order_by(desc(Idea.innovation_score)).limit(limit).all()

    def list_categories(self, db: Session):
        results = db.query(Idea.platform).distinct().all()
        return [r[0] for r in results if r[0]]
