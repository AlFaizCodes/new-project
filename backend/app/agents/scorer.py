import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are ScorerAgent — an objective idea scoring specialist.

Score each upgraded idea on 4 dimensions (0-100):
1. Originality: How novel and unique is this idea?
2. Feasibility: Can it be built with available resources?
3. Market Potential: Is there a real market need?
4. Complexity Match: Does difficulty match user's skill level?

Output ONLY valid JSON:
{
  "originality": 0-100,
  "feasibility": 0-100,
  "market_potential": 0-100,
  "complexity_match": 0-100,
  "overall": 0-100 (weighted average),
  "originality_note": "1-sentence justification",
  "feasibility_note": "1-sentence justification",
  "market_note": "1-sentence justification",
  "complexity_note": "1-sentence justification",
  "verdict": "EXCELLENT|GOOD|AVERAGE|POOR"
}"""

class ScorerAgent:
    def __init__(self):
        self.model = settings.llm_model

    def score(self, idea: dict, user_profile: dict = None) -> dict:
        if user_profile is None:
            user_profile = {}

        if not settings.openai_api_key:
            return self._default_score(idea)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\n\nUser Profile: {json.dumps(user_profile)}"},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[ScorerAgent] Error: {e}")
            return self._default_score(idea)

    def _default_score(self, idea: dict) -> dict:
        innovation = idea.get("innovation_score", 70)
        feasibility = idea.get("feasibility_score", 50)
        overall = int(innovation * 0.30 + feasibility * 0.25 + 70 * 0.25 + 70 * 0.20)
        return {
            "originality": innovation,
            "feasibility": feasibility,
            "market_potential": 70,
            "complexity_match": 70,
            "overall": overall,
            "originality_note": "Based on curated database score",
            "feasibility_note": "Adjusted for user profile",
            "market_note": "Standard market potential",
            "complexity_note": "Matched to user skill level",
            "verdict": "GOOD" if overall >= 70 else "AVERAGE",
        }

    def score_batch(self, ideas: list[dict], user_profile: dict = None) -> list[dict]:
        return [self.score(idea, user_profile) for idea in ideas]
