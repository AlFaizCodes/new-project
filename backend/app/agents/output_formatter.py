class OutputFormatterAgent:
    """Formats the final output as UI-ready JSON with proper structure."""

    CARD_COLORS = {
        "EXCELLENT": {"bg": "bg-emerald-50", "border": "border-emerald-400", "badge": "emerald", "score": "text-emerald-600"},
        "GOOD": {"bg": "bg-blue-50", "border": "border-blue-400", "badge": "blue", "score": "text-blue-600"},
        "AVERAGE": {"bg": "bg-amber-50", "border": "border-amber-400", "badge": "amber", "score": "text-amber-600"},
        "POOR": {"bg": "bg-red-50", "border": "border-red-400", "badge": "red", "score": "text-red-600"},
    }

    DIFFICULTY_BADGES = {
        "EASY": {"variant": "teal", "label": "Easy"},
        "MEDIUM": {"variant": "sky", "label": "Medium"},
        "HARD": {"variant": "default", "label": "Hard"},
    }

    PLATFORM_ICONS = {
        "WEB": "🌐", "MOBILE": "📱", "AI_ML": "🤖", "BLOCKCHAIN": "⛓️",
        "IOT": "📡", "DESKTOP": "💻", "EXTENSION": "🧩", "API_BACKEND": "🔌",
    }

    def format_cards(self, upgraded_ideas: list[dict], scores: list[dict]) -> list[dict]:
        cards = []
        for idea, score in zip(upgraded_ideas, scores):
            verdict = score.get("verdict", "AVERAGE")
            colors = self.CARD_COLORS.get(verdict, self.CARD_COLORS["AVERAGE"])
            difficulty = idea.get("difficulty", "MEDIUM")
            badge = self.DIFFICULTY_BADGES.get(difficulty, self.DIFFICULTY_BADGES["MEDIUM"])
            platform = idea.get("platform", "WEB")
            icon = self.PLATFORM_ICONS.get(platform, "💡")

            card = {
                "id": idea.get("id", 0),
                "title": idea.get("title", "Untitled Idea"),
                "description": idea.get("description", ""),
                "problem_statement": idea.get("problem_statement", ""),
                "solution": idea.get("solution", ""),
                "key_features": idea.get("key_features", []),
                "innovation_score": idea.get("innovation_score", 0),
                "feasibility_score": idea.get("feasibility_score", 0),
                "difficulty": difficulty,
                "difficulty_badge": badge,
                "platform": platform,
                "platform_icon": icon,
                "suggested_stack": idea.get("suggested_stack", {}),
                "upgrade_notes": idea.get("upgrade_notes", []),
                "tags": idea.get("tags", []),
                "scores": score,
                "card_colors": colors,
                "overall_score": score.get("overall", 0),
                "is_curated": idea.get("is_curated", False),
                "curated_source": idea.get("source", None),
            }
            cards.append(card)
        return cards

    def format_pipeline_output(self, parsed_input: dict, retrieved_count: int, cards: list[dict]) -> dict:
        return {
            "parsed_input": {
                "problem_statement": parsed_input.get("problem_statement", ""),
                "platform": parsed_input.get("platform", "WEB"),
                "target_audience": parsed_input.get("target_audience", ""),
                "tone": parsed_input.get("tone", "neutral"),
                "keywords": parsed_input.get("keywords", []),
            },
            "retrieved_count": retrieved_count,
            "cards": cards,
        }
