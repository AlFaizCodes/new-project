import httpx
from bs4 import BeautifulSoup
from app.fetchers.base import BaseFetcher

class DevpostFetcher(BaseFetcher):
    async def fetch(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.get("https://devpost.com/software/search?page=1")
                resp.raise_for_status()
                soup = BeautifulSoup(resp.text, "lxml")
                ideas = []
                for card in soup.select(".software-entry")[:20]:
                    title_el = card.select_one(".entry-title a")
                    desc_el = card.select_one(".entry-body small")
                    if title_el:
                        ideas.append({
                            "title": title_el.text.strip(),
                            "url": title_el.get("href", ""),
                            "description": desc_el.text.strip() if desc_el else "",
                            "source_id": title_el.get("href", "").split("/")[-1],
                            "category": "General",
                            "tags": [],
                        })
                return ideas
        except Exception as e:
            print(f"[Devpost] Error: {e}")
            return []
