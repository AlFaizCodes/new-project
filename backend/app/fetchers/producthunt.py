import httpx
from app.config import settings
from app.fetchers.base import BaseFetcher

class ProductHuntFetcher(BaseFetcher):
    async def fetch(self) -> list[dict]:
        if not settings.product_hunt_api_key:
            return []
        query = """
        { posts(first: 20, order: RANKING) {
            edges { node {
                id name tagline description url votesCount
                topics { edges { node { name } } }
            }}
        }}
        """
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(
                    "https://api.producthunt.com/v2/api/graphql",
                    json={"query": query},
                    headers={"Authorization": f"Bearer {settings.product_hunt_api_key}"},
                )
                resp.raise_for_status()
                data = resp.json()
                ideas = []
                for edge in data.get("data", {}).get("posts", {}).get("edges", []):
                    node = edge["node"]
                    ideas.append({
                        "title": node["name"],
                        "description": node.get("tagline", ""),
                        "url": node.get("url", ""),
                        "source_id": str(node.get("id", "")),
                        "category": "Startup",
                        "tags": [t["node"]["name"] for t in node.get("topics", {}).get("edges", [])],
                        "author": "",
                        "upvotes": node.get("votesCount", 0),
                    })
                return ideas
        except Exception as e:
            print(f"[ProductHunt] Error: {e}")
            return []
