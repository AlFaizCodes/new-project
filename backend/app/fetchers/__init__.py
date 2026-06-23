from app.fetchers.devpost import DevpostFetcher
from app.fetchers.producthunt import ProductHuntFetcher
from app.fetchers.github import GitHubFetcher
from app.fetchers.hackernews import HackerNewsFetcher
from app.fetchers.reddit import RedditFetcher

ALL_FETCHERS = {
    "devpost": DevpostFetcher(),
    "producthunt": ProductHuntFetcher(),
    "github": GitHubFetcher(),
    "hackernews": HackerNewsFetcher(),
    "reddit": RedditFetcher(),
}

def get_fetcher(source: str):
    return ALL_FETCHERS.get(source)

async def fetch_all():
    all_ideas = []
    for name, fetcher in ALL_FETCHERS.items():
        try:
            ideas = await fetcher.fetch()
            for idea in ideas:
                idea["source"] = name
            all_ideas.extend(ideas)
        except Exception as e:
            print(f"[{name}] Fetch error: {e}")
    return all_ideas
