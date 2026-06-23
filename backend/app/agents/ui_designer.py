import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

LANDING_PROMPT = """You are a senior UI/UX designer. Generate a complete, production-ready HTML/CSS landing page.

Requirements:
- Tailwind CSS via CDN (no build step)
- Dark theme (bg-slate-900 text-white) for MODERN, Light theme (bg-white) for MINIMAL
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
  "style_variant": "MODERN",
  "screen_type": "landing"
}"""

DASHBOARD_PROMPT = """You are a senior UI/UX designer. Generate a complete, production-ready HTML/CSS admin dashboard page.

Requirements:
- Tailwind CSS via CDN (no build step)
- Dark sidebar + light content area for MODERN, fully light for MINIMAL
- Real data, charts (simple div-based bars), tables
- Placeholder images from picsum.photos
- Responsive with collapsible sidebar
- Include: Sidebar nav, Top header with search/user menu, Stats cards row, Data table, Activity feed

Output ONLY a complete HTML document wrapped in a JSON object:
{
  "html": "<!DOCTYPE html>...",
  "css": null,
  "components": {"sidebar": true, "header": true, "stats": true, "table": true, "activity": true},
  "style_variant": "MODERN",
  "screen_type": "dashboard"
}"""

MOBILE_PROMPT = """You are a senior UI/UX designer. Generate a complete, production-ready HTML/CSS mobile app page.

Requirements:
- Tailwind CSS via CDN (no build step)
- Dark theme for MODERN, light for MINIMAL
- Mobile-first (max-width: 430px, centered)
- Real content
- Bottom tab navigation with icons (use emoji as icons)
- Include: Top app bar, Content feed/cards, Bottom tab bar (Home, Search, Profile, Settings)

Output ONLY a complete HTML document wrapped in a JSON object:
{
  "html": "<!DOCTYPE html>...",
  "css": null,
  "components": {"app_bar": true, "content": true, "bottom_tabs": true},
  "style_variant": "MODERN",
  "screen_type": "mobile"
}"""

SETTINGS_PROMPT = """You are a senior UI/UX designer. Generate a complete, production-ready HTML/CSS settings page.

Requirements:
- Tailwind CSS via CDN (no build step)
- Clean, organized layout
- Form elements: text inputs, toggles, dropdowns, sliders
- Section dividers
- Save button

Output ONLY a complete HTML document wrapped in a JSON object:
{
  "html": "<!DOCTYPE html>...",
  "css": null,
  "components": {"form": true, "sections": true},
  "style_variant": "MODERN",
  "screen_type": "settings"
}"""

COMPONENT_PROMPT = """You are a senior UI/UX designer. Generate a single reusable HTML/CSS component.

Requirements:
- Tailwind CSS via CDN (no build step)
- Self-contained (no external dependencies)
- Responsive
- Accessible

Output ONLY a complete HTML document wrapped in a JSON object:
{
  "html": "<!DOCTYPE html>...",
  "css": null,
  "component_name": "string",
  "style_variant": "MODERN",
  "props": {"prop_name": "description"}
}"""

SCREEN_PROMPTS = {
    "landing": LANDING_PROMPT,
    "dashboard": DASHBOARD_PROMPT,
    "mobile": MOBILE_PROMPT,
    "settings": SETTINGS_PROMPT,
}

STYLE_VARIANTS = {
    "MODERN": "Dark theme, bg-slate-900, blue-600 accent, sharp corners",
    "MINIMAL": "Light theme, bg-white, gray-800 text, minimal borders, lots of whitespace",
    "PLAYFUL": "Warm theme, bg-amber-50, purple-500 accent, rounded corners, fun gradients",
    "CORPORATE": "Professional theme, bg-white, blue-700 accent, clean lines, serif headings",
    "DARK": "True dark, bg-black, emerald-400 accent, glow effects, glass morphism",
}


class UIDesignerAgent:
    def __init__(self):
        self.model = settings.llm_model

    def generate(self, idea: dict, blueprint: dict = None, style_variant: str = "MODERN", screen_type: str = "landing") -> dict:
        if not settings.openai_api_key:
            return self._fallback(idea, style_variant, screen_type)

        prompt = SCREEN_PROMPTS.get(screen_type, LANDING_PROMPT)
        style_desc = STYLE_VARIANTS.get(style_variant, STYLE_VARIANTS["MODERN"])

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\nBlueprint: {json.dumps(blueprint or {})}\n\nStyle: {style_variant} — {style_desc}\n\nGenerate complete HTML page."},
                ],
                temperature=0.5,
                response_format={"type": "json_object"},
            )
            result = json.loads(resp.choices[0].message.content)
            result["style_variant"] = style_variant
            result["screen_type"] = screen_type
            return result
        except Exception as e:
            print(f"[UIDesigner] Error: {e}")
            return self._fallback(idea, style_variant, screen_type)

    def generate_component(self, idea: dict, component_type: str, style_variant: str = "MODERN") -> dict:
        if not settings.openai_api_key:
            return self._component_fallback(component_type, style_variant)

        style_desc = STYLE_VARIANTS.get(style_variant, STYLE_VARIANTS["MODERN"])
        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": COMPONENT_PROMPT},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\nComponent: {component_type}\nStyle: {style_variant} — {style_desc}\n\nGenerate the component HTML."},
                ],
                temperature=0.5,
                response_format={"type": "json_object"},
            )
            result = json.loads(resp.choices[0].message.content)
            result["style_variant"] = style_variant
            result["component_type"] = component_type
            return result
        except Exception as e:
            print(f"[UIDesigner] Component Error: {e}")
            return self._component_fallback(component_type, style_variant)

    def list_style_variants(self) -> list[str]:
        return list(STYLE_VARIANTS.keys())

    def list_screen_types(self) -> list[str]:
        return list(SCREEN_PROMPTS.keys())

    def _fallback(self, idea: dict, style_variant: str = "MODERN", screen_type: str = "landing") -> dict:
        title = idea.get("title", "My Project")
        desc = idea.get("description", "Amazing project description")
        theme_class = "bg-slate-900 text-white" if style_variant in ("MODERN", "DARK") else "bg-white text-gray-900"
        accent = "bg-blue-600 hover:bg-blue-700" if style_variant in ("MODERN", "MINIMAL", "CORPORATE") else "bg-purple-600 hover:bg-purple-700"
        return {
            "html": f"""<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>{title}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="{theme_class}"><header class="p-6 flex justify-between items-center max-w-6xl mx-auto"><h1 class="text-xl font-bold">{title}</h1><nav><a href="#" class="opacity-70 hover:opacity-100 px-4">Features</a><a href="#" class="opacity-70 hover:opacity-100 px-4">About</a></nav></header><main class="max-w-6xl mx-auto px-6 py-20"><section class="text-center"><h2 class="text-5xl font-bold mb-4">{title}</h2><p class="text-xl opacity-70 mb-8">{desc}</p><a href="#" class="{accent} text-white px-8 py-3 rounded-lg inline-block">Get Started</a></section></main><footer class="text-center opacity-50 p-6"><p>&copy; 2026 {title}. All rights reserved.</p></footer></body></html>""",
            "css": None,
            "components": {"header": True, "hero": True, "features": False, "how_it_works": False, "testimonials": False, "cta": True, "footer": True},
            "style_variant": style_variant,
            "screen_type": screen_type,
        }

    def _component_fallback(self, component_type: str, style_variant: str = "MODERN") -> dict:
        return {
            "html": f"""<div class="p-4 bg-white dark:bg-slate-800 rounded-lg shadow"><p class="text-sm text-gray-500">{component_type} component — {style_variant}</p></div>""",
            "css": None,
            "component_name": component_type,
            "component_type": component_type,
            "style_variant": style_variant,
        }
