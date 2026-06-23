import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are a Senior Technical Architect with 15+ years experience. Generate a complete production-ready blueprint for the selected idea.

Output MUST be valid JSON with these 7 sections:
{
  "overview": "2-3 sentence elevator pitch (problem + solution + audience + UVP)",
  "prd": {
    "objectives": ["SMART objective 1", "objective 2"],
    "features": [{"name": "Feature", "priority": "MUST|SHOULD|COULD", "description": "..."}],
    "user_stories": ["As a..., I want..., so that..."],
    "acceptance_criteria": ["Given/When/Then criteria"]
  },
  "tech_stack": {
    "frontend": {"choice": "...", "why": "..."},
    "backend": {"choice": "...", "why": "..."},
    "database": {"choice": "...", "why": "..."},
    "ai_ml": {"choice": "...", "why": "..."},
    "devops": {"choice": "...", "why": "..."}
  },
  "database_schema": {
    "tables": [{"name": "...", "fields": [{"name": "...", "type": "...", "constraints": "..."}]}],
    "indexes": [{"table": "...", "columns": ["..."], "type": "..."}],
    "relations": [{"from": "...", "to": "...", "type": "one-to-many"}]
  },
  "api_design": {
    "base_url": "...",
    "version": "v1",
    "endpoints": [{"path": "...", "method": "GET|POST|PUT|DELETE", "auth": true, "request": {}, "response": {}}],
    "rate_limiting": "..."
  },
  "user_flow": [
    {"step": 1, "screen": "...", "user_action": "...", "system_response": "..."}
  ],
  "implementation_plan": {
    "phases": [{"phase": 1, "name": "...", "duration": "...", "milestones": ["..."], "deliverables": ["..."]}],
    "risks": [{"risk": "...", "mitigation": "...", "severity": "HIGH|MEDIUM|LOW"}]
  }
}"""

class BlueprintArchitectAgent:
    def __init__(self):
        self.model = settings.llm_model

    def generate(self, idea: dict, user_profile: dict = None) -> dict:
        if user_profile is None:
            user_profile = {}

        if not settings.openai_api_key:
            return self._fallback(idea)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Selected Idea: {json.dumps(idea)}\n\nUser Profile: {json.dumps(user_profile)}\n\nGenerate complete blueprint with all 7 sections."},
                ],
                temperature=0.4,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[BlueprintArchitect] Error: {e}")
            return self._fallback(idea)

    def _fallback(self, idea: dict) -> dict:
        title = idea.get("title", "Project")
        return {
            "overview": f"A {title} platform that solves {idea.get('problem_statement', 'a key problem')} for {idea.get('target_audience', 'users')}.",
            "prd": {"objectives": [f"Launch MVP of {title}"], "features": [{"name": "Core Feature", "priority": "MUST", "description": "Main functionality"}], "user_stories": [f"As a user, I want to use {title} so that I can solve my problem."], "acceptance_criteria": ["System responds within 2 seconds"]},
            "tech_stack": {"frontend": {"choice": "React", "why": "Widely used, large ecosystem"}, "backend": {"choice": "Node.js", "why": "Fast prototyping"}, "database": {"choice": "PostgreSQL", "why": "Reliable, scalable"}, "ai_ml": {"choice": "OpenAI API", "why": "Best AI capabilities"}, "devops": {"choice": "Vercel", "why": "Easy deployment"}},
            "database_schema": {"tables": [{"name": "users", "fields": [{"name": "id", "type": "UUID", "constraints": "PK"}]}], "indexes": [], "relations": []},
            "api_design": {"base_url": "/api/v1", "version": "v1", "endpoints": [{"path": "/health", "method": "GET", "auth": False, "request": {}, "response": {"status": "ok"}}], "rate_limiting": "100 req/min"},
            "user_flow": [{"step": 1, "screen": "Landing", "user_action": "Visit site", "system_response": "Show landing page"}],
            "implementation_plan": {"phases": [{"phase": 1, "name": "MVP", "duration": "4 weeks", "milestones": ["Core features done"], "deliverables": ["Working prototype"]}], "risks": [{"risk": "Scope creep", "mitigation": "Strict MVP focus", "severity": "MEDIUM"}]},
        }
