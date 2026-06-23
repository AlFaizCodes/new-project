import httpx
from app.config import settings
from app.fetchers.base import BaseFetcher

class GitHubFetcher(BaseFetcher):
    async def fetch(self) -> list[dict]:
        if not settings.github_token:
            return []
        headers = {
            "Authorization": f"token {settings.github_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        queries = [
            "stars:>100 created:>2024-01-01",
            "topic:hackathon",
            "topic:startup",
        ]
        ideas = []
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                for q in queries:
                    resp = await client.get(
                        "https://api.github.com/search/repositories",
                        params={"q": q, "sort": "stars", "per_page": 10},
                        headers=headers,
                    )
                    resp.raise_for_status()
                    for item in resp.json().get("items", []):
                        ideas.append({
                            "title": item.get("full_name", ""),
                            "description": item.get("description", ""),
                            "url": item.get("html_url", ""),
                            "source_id": str(item.get("id", "")),
                            "category": "Open Source" if "hackathon" not in q else "Hackathon",
                            "tags": [t for t in item.get("topics", [])],
                            "author": item.get("owner", {}).get("login", ""),
                            "upvotes": item.get("stargazers_count", 0),
                        })
            return ideas
        except Exception as e:
            print(f"[GitHub] Error: {e}")
            return []
