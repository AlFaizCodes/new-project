import httpx
from app.config import settings
from app.fetchers.base import BaseFetcher

class RedditFetcher(BaseFetcher):
    async def fetch(self) -> list[dict]:
        if not settings.reddit_client_id:
            return []
        auth = httpx.BasicAuth(settings.reddit_client_id, settings.reddit_client_secret)
        headers = {"User-Agent": "IdeaDNA/1.0"}
        subreddits = ["startups", "SideProject", "SomebodyMakeThis", "hackathon"]

        ideas = []
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                token_resp = await client.post(
                    "https://www.reddit.com/api/v1/access_token",
                    auth=auth,
                    data={"grant_type": "client_credentials"},
                    headers=headers,
                )
                if token_resp.status_code != 200:
                    return []
                token = token_resp.json().get("access_token", "")
                headers["Authorization"] = f"Bearer {token}"

                for sub in subreddits:
                    resp = await client.get(
                        f"https://oauth.reddit.com/r/{sub}/hot",
                        params={"limit": 15},
                        headers=headers,
                    )
                    if resp.status_code != 200:
                        continue
                    for post in resp.json().get("data", {}).get("children", []):
                        data = post["data"]
                        ideas.append({
                            "title": data.get("title", ""),
                            "description": data.get("selftext", "") or "",
                            "url": f"https://reddit.com{data.get('permalink', '')}",
                            "source_id": data.get("id", ""),
                            "category": "Community",
                            "tags": [sub],
                            "author": data.get("author", ""),
                            "upvotes": data.get("ups", 0),
                        })
            return ideas
        except Exception as e:
            print(f"[Reddit] Error: {e}")
            return []
