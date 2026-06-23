import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are InputParserAgent — an expert at extracting structured information from raw user input.

Extract: 
1. Core problem statement (what the user wants to solve)
2. Implied platform (web/mobile/ai/blockchain/iot/desktop/extension/api)
3. Target audience (who will use this)
4. Key constraints mentioned (budget, timeline, skill level)
5. Emotional tone (urgent/casual/excited/neutral)

Output ONLY valid JSON with no markdown:
{
  "problem_statement": "string",
  "platform": "WEB|MOBILE|AI_ML|BLOCKCHAIN|IOT|DESKTOP|EXTENSION|API_BACKEND",
  "target_audience": "string",
  "constraints": {"budget": "int or null", "timeline": "string or null", "skill_level": "string or null"},
  "tone": "string",
  "keywords": ["string"]
}"""

class InputParserAgent:
    def __init__(self):
        self.model = settings.llm_model

    def parse(self, raw_input: str) -> dict:
        if not settings.openai_api_key:
            return {
                "problem_statement": raw_input,
                "platform": "WEB",
                "target_audience": "General",
                "constraints": {"budget": None, "timeline": None, "skill_level": None},
                "tone": "neutral",
                "keywords": [raw_input[:20]],
            }
        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Input: {raw_input}"},
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[InputParser] Error: {e}")
            return {"problem_statement": raw_input, "platform": "WEB", "target_audience": "General", "constraints": {}, "tone": "neutral", "keywords": []}
