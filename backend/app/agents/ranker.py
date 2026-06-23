class RankerAgent:
    """Rank retrieved ideas by user profile constraints.
       Weight: Feasibility > Innovation > Trending score"""

    def rank(self, ideas: list[dict], skill_level: str = "BEGINNER", budget: int = 0, team_size: int = 1, tech_prefs: list = None) -> list[dict]:
        if tech_prefs is None:
            tech_prefs = []

        def compute_score(idea: dict) -> float:
            innovation = idea.get("innovation_score", 50) / 100.0
            market = idea.get("market_potential", 50) / 100.0
            similarity = idea.get("similarity", 0.0)
            trending = min(idea.get("trending_score", 0) / 100.0, 1.0)

            # Difficulty match
            complexity = idea.get("complexity", "MEDIUM")
            diff_map = {"EASY": 1.0, "MEDIUM": 0.7, "HARD": 0.3}
            skill_map = {"BEGINNER": 1.0, "INTERMEDIATE": 0.6, "ADVANCED": 0.2}
            diff_score = 1.0 - abs(diff_map.get(complexity, 0.5) - skill_map.get(skill_level, 0.5))

            # Tech preference boost
            tech_boost = 0.0
            stack = idea.get("suggested_stack", {}) or {}
            if tech_prefs:
                stack_str = str(stack).lower()
                for pref in tech_prefs:
                    if pref.lower() in stack_str:
                        tech_boost += 0.05

            return (
                similarity * 0.15 +
                innovation * 0.25 +
                market * 0.15 +
                diff_score * 0.30 +
                trending * 0.05 +
                tech_boost * 0.10
            )

        scored = [(compute_score(idea), idea) for idea in ideas]
        scored.sort(key=lambda x: x[0], reverse=True)
        return [idea for score, idea in scored]
