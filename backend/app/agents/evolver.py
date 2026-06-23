import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are an Idea Evolution Specialist. Take the original idea + critic's feedback and generate evolved versions.

Each version must:
1. Fix at least one HIGH/CRITICAL weakness from the critic report
2. Follow one mutation vector from critic's suggestions
3. Have a clear Mutation Tag
4. Add specific new features that justify the mutation
5. Keep core concept recognizable
6. Adjust complexity for user's skill level

Output ONLY valid JSON with an "evolutions" array:
{
  "evolutions": [
    {
      "version_name": "Name of evolved version",
      "mutation_tag": "AI_ENHANCED|BLOCKCHAIN|ANALYTICS|ENTERPRISE|SOCIAL_IMPACT|IOT|SECURITY|GAMIFICATION|MOBILE_FIRST|API_FIRST",
      "enhancements": ["new feature 1", "new feature 2"],
      "fixes": ["which weakness it addresses"],
      "trade_offs": ["what's sacrificed"],
      "estimated_complexity": "EASY|MEDIUM|HARD",
      "description": "Brief description of this version"
    }
  ]
}"""

class EvolverAgent:
    def __init__(self):
        self.model = settings.llm_model

    def evolve(self, title: str, description: str, critic_report: dict, features: list = None, user_profile: dict = None, count: int = 5) -> list[dict]:
        if not settings.openai_api_key:
            return self._fallback(count)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Original Idea: {{'title': '{title}', 'description': '{description}', 'features': {json.dumps(features or [])}}}\nCritic Report: {json.dumps(critic_report)}\nUser Profile: {json.dumps(user_profile or {})}\n\nGenerate {count} evolved versions."},
                ],
                temperature=0.6,
                response_format={"type": "json_object"},
            )
            data = json.loads(resp.choices[0].message.content)
            return data.get("evolutions", [])[:count]
        except Exception as e:
            print(f"[EvolverAgent] Error: {e}")
            return self._fallback(count)

    def _fallback(self, count: int = 5) -> list[dict]:
        versions = [
            {"version_name": "AI-Powered Predictive Version", "mutation_tag": "AI_ENHANCED", "enhancements": ["AI prediction engine", "Smart recommendations", "Automated insights"], "fixes": ["Lack of intelligence in core features"], "trade_offs": ["Higher API costs", "Requires ML expertise"], "estimated_complexity": "HARD", "description": "Enhanced with AI/ML capabilities for predictive features and smart automation."},
            {"version_name": "Blockchain Secured Version", "mutation_tag": "BLOCKCHAIN", "enhancements": ["Immutable audit trail", "Smart contract automation", "Decentralized storage"], "fixes": ["Trust and verification gaps"], "trade_offs": ["Slower transaction times", "Higher development complexity"], "estimated_complexity": "HARD", "description": "Adds blockchain-based security, transparency, and decentralized trust mechanisms."},
            {"version_name": "Analytics Dashboard Version", "mutation_tag": "ANALYTICS", "enhancements": ["Real-time dashboards", "Custom reports", "Predictive analytics"], "fixes": ["No data-driven insights"], "trade_offs": ["Requires data infrastructure", "More complex UX"], "estimated_complexity": "MEDIUM", "description": "Rich analytics layer with customizable dashboards and business intelligence."},
            {"version_name": "Enterprise Ready Version", "mutation_tag": "ENTERPRISE", "enhancements": ["SSO/OAuth integration", "Role-based access control", "Audit logging", "SLA guarantees"], "fixes": ["Not suitable for enterprise clients"], "trade_offs": ["Heavier infrastructure", "Slower feature iteration"], "estimated_complexity": "MEDIUM", "description": "Enterprise-grade features: SSO, RBAC, audit logs, and compliance-ready architecture."},
            {"version_name": "Social Impact Version", "mutation_tag": "SOCIAL_IMPACT", "enhancements": ["Community features", "Impact tracking", "Collaboration tools", "Shared resources"], "fixes": ["Limited network effects"], "trade_offs": ["Moderation overhead", "Slower initial growth"], "estimated_complexity": "EASY", "description": "Community-driven features with social impact tracking and collaboration."},
            {"version_name": "IoT-Connected Version", "mutation_tag": "IOT", "enhancements": ["Sensor integration", "Real-time monitoring", "Edge computing", "Device management"], "fixes": ["No physical world integration"], "trade_offs": ["Hardware costs", "Maintenance overhead"], "estimated_complexity": "HARD", "description": "Connects to physical devices via IoT sensors for real-world data collection and control."},
        ]
        return versions[:count]
