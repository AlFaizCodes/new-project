from sqlalchemy.orm import Session
from sqlalchemy import text
from app.models.idea import CuratedIdea
from app.agents.embedding import EmbeddingGenerator
from app.config import settings

embedder = EmbeddingGenerator()
USE_PGVECTOR = settings.database_url.startswith("postgresql")

class RetrieverAgent:
    """Semantic search in curated database with platform + user constraint filtering."""

    def retrieve(self, db: Session, user_input: str, platform: str = None, skill_level: str = None, budget: int = 0, limit: int = 10) -> list[CuratedIdea]:
        embedding = embedder.generate(user_input) if USE_PGVECTOR else None

        if USE_PGVECTOR and embedding and all(v == 0.0 for v in embedding):
            embedding = None

        if embedding:
            query = """
                SELECT id, title, description, problem_statement, solution, key_features,
                       platform, sub_category, innovation_score, market_potential, complexity,
                       suggested_stack, tags, source, trending_score,
                       1 - (embedding <=> :embedding::vector) as similarity
                FROM curated_ideas
                WHERE (platform = :platform OR :platform IS NULL)
                ORDER BY similarity DESC, innovation_score DESC
                LIMIT :limit
            """
            params = {"embedding": str(embedding), "platform": platform, "limit": limit}
        else:
            query = """
                SELECT id, title, description, problem_statement, solution, key_features,
                       platform, sub_category, innovation_score, market_potential, complexity,
                       suggested_stack, tags, source, trending_score, 0 as similarity
                FROM curated_ideas
                WHERE (platform = :platform OR :platform IS NULL)
                ORDER BY innovation_score DESC, trending_score DESC
                LIMIT :limit
            """
            params = {"platform": platform, "limit": limit}

        results = db.execute(text(query), params).fetchall()

        ideas = []
        for row in results:
            complexity = row.complexity
            if skill_level == "BEGINNER" and complexity == "HARD":
                continue
            if budget == 0 and row.suggested_stack:
                stack = row.suggested_stack if isinstance(row.suggested_stack, dict) else {}
                if stack.get("requires_paid_api"):
                    continue
            ideas.append({
                "id": row.id,
                "title": row.title,
                "description": row.description,
                "problem_statement": row.problem_statement,
                "solution": row.solution,
                "key_features": row.key_features if row.key_features else [],
                "platform": row.platform,
                "sub_category": row.sub_category,
                "innovation_score": row.innovation_score,
                "market_potential": row.market_potential,
                "complexity": row.complexity,
                "suggested_stack": row.suggested_stack,
                "tags": row.tags if row.tags else [],
                "source": row.source,
                "trending_score": row.trending_score,
                "similarity": float(row.similarity) if hasattr(row, "similarity") else 0.0,
            })

        return ideas[:limit]
