import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are a senior UI/UX designer. Generate a complete, production-ready HTML/CSS landing page for the selected idea.

Requirements:
- Tailwind CSS via CDN (no build step)
- Dark theme (bg-slate-900 text-white)
- Real content (not lorem ipsum)
- Placeholder images from picsum.photos
- Responsive (mobile-first)
- Interactive hover states
- Accessibility: semantic HTML, proper contrast, alt text
- Include ALL 7 sections: Header, Hero, Features, How It Works, Testimonials, CTA, Footer

Output ONLY a complete HTML document wrapped in a JSON object:
{
  "html": "<!DOCTYPE html>...",
  "css": null,
  "components": {"header": true, "hero": true, "features": true, "how_it_works": true, "testimonials": true, "cta": true, "footer": true},
  "style_variant": "MODERN"
}"""

class UIDesignerAgent:
    def __init__(self):
        self.model = settings.llm_model

    def generate(self, idea: dict, blueprint: dict = None, style_variant: str = "MODERN") -> dict:
        if not settings.openai_api_key:
            return self._fallback(idea, style_variant)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\nBlueprint: {json.dumps(blueprint or {})}\n\nStyle: {style_variant}\n\nGenerate complete HTML page."},
                ],
                temperature=0.5,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[UIDesigner] Error: {e}")
            return self._fallback(idea, style_variant)

    def _fallback(self, idea: dict, style_variant: str = "MODERN") -> dict:
        title = idea.get("title", "My Project")
        desc = idea.get("description", "Amazing project description")
        return {
            "html": f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{title}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-900 text-white"><header class="p-6 flex justify-between items-center max-w-6xl mx-auto"><h1 class="text-xl font-bold">{title}</h1><nav><a href="#" class="text-slate-300 hover:text-white px-4">Features</a><a href="#" class="text-slate-300 hover:text-white px-4">About</a></nav></header><main class="max-w-6xl mx-auto px-6 py-20"><section class="text-center"><h2 class="text-5xl font-bold mb-4">{title}</h2><p class="text-xl text-slate-300 mb-8">{desc}</p><a href="#" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">Get Started</a></section></main><footer class="text-center text-slate-500 p-6"><p>&copy; 2026 {title}. All rights reserved.</p></footer></body></html>""",
            "css": None,
            "components": {"header": True, "hero": True, "features": False, "how_it_works": False, "testimonials": False, "cta": True, "footer": True},
            "style_variant": style_variant,
        }
