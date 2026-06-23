import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are an AI Idea Generator. Generate creative, viable startup/product ideas based on a user's problem statement.

For each idea, output a JSON object with:
- title: short catchy name
- description: 1-2 sentence pitch
- problem_statement: what problem it solves
- solution: how it works at a high level
- key_features: list of 3-5 features
- innovation_score: 0-100
- feasibility_score: 0-100
- difficulty: EASY | MEDIUM | HARD
- suggested_stack: {"frontend": "...", "backend": "...", "database": "...", "hosting": "..."}
- tags: list of 2-4 relevant tags
- market_potential: brief note on market size / TAM

Output ONLY valid JSON as an array of idea objects."""

class GenerationService:
    def __init__(self):
        self.model = settings.llm_model

    def generate_ideas(self, raw_input: str, parsed: dict, user_profile: dict, count: int = 5) -> list[dict]:
        if not settings.openai_api_key:
            return self._mock_ideas(raw_input, count)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Problem: {raw_input}\n\nParsed Context: {json.dumps(parsed)}\n\nUser Profile: {json.dumps(user_profile)}\n\nGenerate {count} ideas."},
                ],
                temperature=0.6,
                response_format={"type": "json_object"},
            )
            raw = json.loads(resp.choices[0].message.content)
            ideas = raw if isinstance(raw, list) else raw.get("ideas", raw.get("data", []))
            if isinstance(ideas, dict):
                ideas = [ideas]
            return ideas[:count]
        except Exception as e:
            print(f"[GenerationService] Error: {e}")
            return self._mock_ideas(raw_input, count)

    def _mock_ideas(self, raw_input: str, count: int) -> list[dict]:
        ideas = [
            {
                "title": "SkillPath AI",
                "description": "Personalized AI tutor that builds adaptive learning paths based on your skill level and goals.",
                "problem_statement": raw_input,
                "solution": "Uses LLM to assess current knowledge and generate custom curriculum with interactive exercises.",
                "key_features": ["Adaptive diagnostics", "Personalized curriculum", "Progress tracking", "Gamified challenges", "Peer review"],
                "innovation_score": 82,
                "feasibility_score": 78,
                "difficulty": "MEDIUM",
                "suggested_stack": {"frontend": "React", "backend": "FastAPI", "database": "PostgreSQL", "hosting": "AWS"},
                "tags": ["edtech", "ai", "personalization"],
                "market_potential": "Global edtech market $740B by 2030",
            },
            {
                "title": "CodeCompanion",
                "description": "An interactive pair-programming tool that explains every line of code in plain language.",
                "problem_statement": raw_input,
                "solution": "Real-time code explanation and pair programming assistant integrated into VS Code.",
                "key_features": ["Line-by-line explanations", "Voice-guided coding", "Auto-refactor suggestions", "Built-in debugger tutor"],
                "innovation_score": 85,
                "feasibility_score": 72,
                "difficulty": "HARD",
                "suggested_stack": {"frontend": "VS Code Extension", "backend": "Python", "database": "SQLite", "hosting": "Marketplace"},
                "tags": ["developer-tools", "edtech", "ai"],
                "market_potential": "25M+ developers worldwide",
            },
            {
                "title": "ProjectForge",
                "description": "Project-based learning platform where you build real apps while following structured tutorials.",
                "problem_statement": raw_input,
                "solution": "Curated project roadmaps with incremental difficulty, code reviews, and community mentorship.",
                "key_features": ["Project roadmaps", "AI code review", "Mentor matching", "Portfolio builder", "Community forum"],
                "innovation_score": 78,
                "feasibility_score": 85,
                "difficulty": "EASY",
                "suggested_stack": {"frontend": "Next.js", "backend": "Node.js", "database": "MongoDB", "hosting": "Vercel"},
                "tags": ["edtech", "community", "projects"],
                "market_potential": "Bootcamp market $5B+ annually",
            },
        ]
        return ideas[:count]
