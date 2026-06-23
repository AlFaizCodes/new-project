import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are a ruthless product critic and venture capitalist. Analyze this idea brutally.

Find:
1. WEAKNESSES (what's missing? what could fail?) — each with severity: LOW, MEDIUM, HIGH, CRITICAL
2. GAPS (what do competitors already do better?)
3. RISKS (technical, market, legal, scalability)
4. OPPORTUNITIES (what's the next level? what tech could enhance this?) — each with impact: LOW, MEDIUM, HIGH
5. MUTATION VECTORS (5-6 specific directions to evolve): AI, Blockchain, Analytics, Social, Enterprise, IoT, Security, etc.

Rules:
- Be brutally honest, not polite
- Every weakness must have a severity
- Every opportunity must have an impact level
- Suggest 5-6 specific mutation directions

Output ONLY valid JSON:
{
  "weaknesses": [{"severity": "HIGH|MEDIUM|LOW|CRITICAL", "text": "..."}],
  "gaps": ["gap1", "gap2"],
  "risks": ["risk1", "risk2"],
  "opportunities": [{"impact": "HIGH|MEDIUM|LOW", "text": "..."}],
  "mutation_vectors": ["AI_ENHANCED", "BLOCKCHAIN", "ANALYTICS", "ENTERPRISE", "SOCIAL_IMPACT", "IOT", "SECURITY", "GAMIFICATION", "MOBILE_FIRST", "API_FIRST"]
}"""

class CriticAgent:
    def __init__(self):
        self.model = settings.llm_model

    def analyze(self, title: str, description: str, features: list = None, user_profile: dict = None) -> dict:
        if not settings.openai_api_key:
            return self._fallback()

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Original Idea: {{'title': '{title}', 'description': '{description}', 'features': {json.dumps(features or [])}}}\nUser Profile: {json.dumps(user_profile or {})}"},
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[CriticAgent] Error: {e}")
            return self._fallback()

    def _fallback(self) -> dict:
        return {
            "weaknesses": [
                {"severity": "HIGH", "text": "No clear differentiation from existing solutions"},
                {"severity": "MEDIUM", "text": "Requires significant upfront investment"},
                {"severity": "HIGH", "text": "Regulatory hurdles may impact timeline"},
                {"severity": "LOW", "text": "User adoption may be slower than expected"},
            ],
            "gaps": ["User authentication not addressed", "No offline mode", "Missing analytics dashboard"],
            "risks": ["Technology may not scale as expected", "Competing with established players", "Team expertise gaps"],
            "opportunities": [
                {"impact": "HIGH", "text": "Integrate AI for predictive features"},
                {"impact": "MEDIUM", "text": "Expand to enterprise segment with SSO"},
                {"impact": "LOW", "text": "Add gamification for user retention"},
            ],
            "mutation_vectors": ["AI_ENHANCED", "ANALYTICS", "ENTERPRISE", "SOCIAL_IMPACT", "GAMIFICATION"],
        }
