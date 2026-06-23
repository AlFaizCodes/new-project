import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are an Idea Upgrade Specialist. Your job is to take a curated idea and upgrade it based on the user's specific needs, constraints, and goals.

Upgrade Rules:
1. KEEP the core concept and innovation of the original idea
2. ADJUST the tech stack to match user's skills and preferences
3. SCALE the complexity to match user's timeline and team size
4. ADD features that specifically address user's stated need
5. REMOVE features that are impossible given user's budget/constraints
6. ENHANCE with trending technologies if user is advanced
7. SIMPLIFY if user is beginner

Output ONLY valid JSON:
{
  "title": "Modified title",
  "description": "Personalized description",
  "problem_statement": "User's specific problem",
  "solution": "Adjusted solution",
  "key_features": ["feature1", "feature2"],
  "innovation_score": 0-100,
  "feasibility_score": 0-100,
  "difficulty": "EASY|MEDIUM|HARD",
  "upgrade_notes": ["what changed and why"],
  "suggested_stack": {"frontend": "...", "backend": "...",
    "database": "...", "hosting": "..."},
  "tags": ["tag1", "tag2"]
}"""

class UpgradeAgent:
    def __init__(self):
        self.model = settings.llm_model

    def upgrade(self, curated_idea: dict, user_profile: dict = None) -> dict:
        if user_profile is None:
            user_profile = {}

        if not settings.openai_api_key:
            return {
                "title": f"{curated_idea.get('title', 'Idea')} (Personalized)",
                "description": curated_idea.get("description", ""),
                "problem_statement": curated_idea.get("problem_statement", ""),
                "solution": curated_idea.get("solution", ""),
                "key_features": curated_idea.get("key_features", []),
                "innovation_score": curated_idea.get("innovation_score", 70),
                "feasibility_score": 85,
                "difficulty": "EASY" if user_profile.get("skill_level") == "BEGINNER" else curated_idea.get("complexity", "MEDIUM"),
                "upgrade_notes": ["Simplified for beginner skill level"],
                "suggested_stack": {"frontend": "HTML + CSS + JS", "backend": "None", "hosting": "GitHub Pages"},
                "tags": curated_idea.get("tags", []),
            }

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Original Idea: {json.dumps(curated_idea)}\n\nUser Profile: {json.dumps(user_profile)}"},
                ],
                temperature=0.6,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[UpgradeAgent] Error: {e}")
            return {
                "title": curated_idea.get("title", "Idea"),
                "description": curated_idea.get("description", ""),
                "problem_statement": curated_idea.get("problem_statement", ""),
                "solution": curated_idea.get("solution", ""),
                "key_features": curated_idea.get("key_features", []),
                "innovation_score": curated_idea.get("innovation_score", 70),
                "feasibility_score": 50,
                "difficulty": curated_idea.get("complexity", "MEDIUM"),
                "upgrade_notes": [],
                "suggested_stack": {"frontend": "React", "backend": "Node.js", "database": "PostgreSQL"},
                "tags": [],
            }
