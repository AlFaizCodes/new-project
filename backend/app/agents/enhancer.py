import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are an expert startup consultant and hackathon judge. Your task is to take a raw idea and enhance it into a unique, market-viable startup concept.

OUTPUT FORMAT (JSON only):
{
  "enhanced_title": "Catchy improved title",
  "enhanced_description": "Detailed value proposition with problem-solution fit",
  "target_audience": "Who will use this",
  "monetization": "How to make money",
  "tech_stack": ["React", "Python", "OpenAI API"],
  "market_potential": "High",
  "difficulty": "Medium",
  "unique_angle": "What makes it different from competitors",
  "competitors": ["Competitor 1", "Competitor 2"],
  "mvp_timeline": "2-3 weeks"
}

RULES:
1. Must be significantly different from original
2. Should solve a real problem
3. Must have clear monetization path
4. Keep tech stack realistic for hackathon
5. Return ONLY valid JSON, no markdown
"""

PROMPT_TO_IDEA_PROMPT = """You are an expert startup idea generator. Based on a user's concept, generate multiple unique startup ideas.

OUTPUT FORMAT (JSON only):
{
  "enhanced_ideas": [
    {
      "enhanced_title": "Idea Name",
      "enhanced_description": "Description",
      "target_audience": "Audience",
      "monetization": "Revenue model",
      "tech_stack": ["Tech1", "Tech2"],
      "market_potential": "High/Medium/Low",
      "difficulty": "Easy/Medium/Hard",
      "unique_angle": "Differentiator",
      "competitors": ["Comp1"],
      "mvp_timeline": "X weeks",
      "uniqueness_score": 0.85
    }
  ]
}

RULES:
1. Generate exactly {count} unique ideas
2. Each must have a different angle
3. Return ONLY valid JSON
"""

class IdeaEnhancer:
    def __init__(self):
        self.model = settings.llm_model

    def enhance(self, title: str, description: str = "", category: str = "", source: str = "") -> dict:
        if not settings.openai_api_key:
            return {
                "enhanced_title": f"Enhanced: {title}",
                "enhanced_description": f"AI-enhanced version of: {description}",
                "target_audience": "Developers",
                "monetization": "SaaS subscriptions",
                "tech_stack": ["React", "Python", "PostgreSQL"],
                "market_potential": "High",
                "difficulty": "Medium",
                "unique_angle": "AI-powered approach",
                "competitors": ["Similar tools"],
                "mvp_timeline": "3-4 weeks",
            }

        user_prompt = f"""INPUT:
- Title: {title}
- Description: {description or 'N/A'}
- Category: {category}
- Source: {source}

OUTPUT:"""
        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[Enhancer] Error: {e}")
            return {"enhanced_title": title, "enhanced_description": description}

    def generate_from_prompt(self, prompt: str, category: str = "", count: int = 3) -> list[dict]:
        if not settings.openai_api_key:
            return [{
                "enhanced_title": f"Idea from: {prompt[:30]}",
                "enhanced_description": f"Based on: {prompt}",
                "target_audience": "General",
                "monetization": "Freemium",
                "tech_stack": ["React", "Node.js"],
                "market_potential": "Medium",
                "difficulty": "Medium",
                "unique_angle": "Novel approach",
                "competitors": [],
                "mvp_timeline": "4 weeks",
                "uniqueness_score": 0.75,
            }]

        user_prompt = f"""Generate {count} startup ideas for:
- Concept: {prompt}
- Category: {category or 'Any'}"""
        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": PROMPT_TO_IDEA_PROMPT.format(count=count)},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.8,
                response_format={"type": "json_object"},
            )
            data = json.loads(resp.choices[0].message.content)
            return data.get("enhanced_ideas", [])
        except Exception as e:
            print(f"[Enhancer] Prompt error: {e}")
            return []
