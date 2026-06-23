from app.agents.archaeologist import CodeArchaeologist

archaeologist = CodeArchaeologist()


class ArchaeologyService:

    def run_analyze_code(self, code: str) -> dict:
        result = archaeologist.analyze_code(code)
        return self._format_report(result)

    def run_analyze_github(self, url: str) -> dict:
        result = archaeologist.analyze_github(url)
        return self._format_report(result)

    def run_analyze_website(self, url: str) -> dict:
        result = archaeologist.analyze_website(url)
        return self._format_report(result)

    def _format_report(self, data: dict) -> dict:
        patterns_text = "\n".join(
            f"{p.get('name', 'Unknown Pattern')} ({p.get('confidence', 'MEDIUM')} confidence) — {p.get('description', '')}"
            for p in data.get("patterns", [])
        )

        timeline_text = "\n".join(
            f"{t.get('version', '?')} ({t.get('date', '?')}): {t.get('description', '')}"
            for t in data.get("evolution_timeline", [])
        )

        psych = data.get("developer_psychology", {})
        psych_text = (
            f"Experience: {psych.get('experience', 'Unknown')}\n"
            f"Style: {psych.get('style', 'Unknown')}\n"
            f"Testing: {psych.get('testing_philosophy', 'Unknown')}\n"
            f"Regrets: {', '.join(psych.get('apparent_regrets', ['None identified']))}\n"
            f"Strengths: {', '.join(psych.get('strengths', ['N/A']))}"
        )

        scores = data.get("scores", {})
        future_versions = [
            f"{v.get('version', '?')}: {v.get('description', '')} ({v.get('priority', 'MEDIUM')})"
            for v in data.get("future_versions", [])
        ]

        return {
            "code_analysis": data.get("code_analysis", "Analysis completed."),
            "patterns": patterns_text,
            "evolution_timeline": timeline_text,
            "developer_psychology": psych_text,
            "scores": {
                "originality": scores.get("originality", 50),
                "feasibility": scores.get("feasibility", 50),
                "market_potential": scores.get("market_potential", 50),
                "complexity": scores.get("complexity", 50),
            },
            "future_versions": future_versions,
            "detected_stack": data.get("detected_stack", {}),
            "architecture_grade": data.get("architecture_grade", "B"),
            "raw_patterns": data.get("patterns", []),
            "raw_timeline": data.get("evolution_timeline", []),
            "raw_psychology": data.get("developer_psychology", {}),
        }
