import httpx
from app.fetchers.base import BaseFetcher

class HackerNewsFetcher(BaseFetcher):
    BASE = "https://hacker-news.firebaseio.com/v0"

    async def fetch(self) -> list[dict]:
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.get(f"{self.BASE}/askstories.json")
                resp.raise_for_status()
                ids = resp.json()[:30]
                ideas = []
                for item_id in ids:
                    item_resp = await client.get(f"{self.BASE}/item/{item_id}.json")
                    if item_resp.status_code != 200:
                        continue
                    item = item_resp.json()
                    if not item or not item.get("title"):
                        continue
                    ideas.append({
                        "title": item.get("title", ""),
                        "description": item.get("text", "") or "",
                        "url": item.get("url", f"https://news.ycombinator.com/item?id={item_id}"),
                        "source_id": str(item_id),
                        "category": "Tech",
                        "tags": ["discussion"],
                        "author": item.get("by", ""),
                        "upvotes": item.get("score", 0),
                    })
                return ideas
        except Exception as e:
            print(f"[HackerNews] Error: {e}")
            return []
