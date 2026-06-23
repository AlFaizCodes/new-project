from sqlalchemy.orm import Session
from app.agents.archaeologist import ArchaeologyPipeline
from app.models.idea import ArchaeologyReport, Project

pipeline = ArchaeologyPipeline()


class ArchaeologyService:

    def _get_source_type(self, code: str = None, github_url: str = None, website_url: str = None) -> str:
        if github_url:
            return "github"
        if website_url:
            return "website"
        return "code"

    def run_analyze_code(self, code: str, project_id: int = None, db: Session = None) -> dict:
        result = pipeline.analyze_code(code)
        return self._save_or_return(result, "code", code=code, project_id=project_id, db=db)

    def run_analyze_github(self, url: str, project_id: int = None, db: Session = None) -> dict:
        result = pipeline.analyze_github(url)
        return self._save_or_return(result, "github", url=url, project_id=project_id, db=db)

    def run_analyze_website(self, url: str, project_id: int = None, db: Session = None) -> dict:
        result = pipeline.analyze_website(url)
        return self._save_or_return(result, "website", url=url, project_id=project_id, db=db)

    def _save_or_return(self, result: dict, input_type: str, url: str = None, code: str = None, project_id: int = None, db: Session = None) -> dict:
        enriched = self._format_report(result, input_type, url, code)

        if project_id and db:
            existing = db.query(ArchaeologyReport).filter(ArchaeologyReport.project_id == project_id).first()
            if existing:
                for key, val in enriched.items():
                    setattr(existing, key, val)
                report = existing
            else:
                report = ArchaeologyReport(
                    project_id=project_id,
                    input_type=input_type,
                    input_url=url,
                    input_code=code[:50000] if code else None,
                    code_analysis=enriched.get("code_analysis"),
                    patterns=enriched.get("raw_patterns"),
                    evolution_timeline=enriched.get("raw_timeline"),
                    thinking_process=enriched.get("raw_psychology"),
                    scores=enriched.get("scores"),
                    future_versions=enriched.get("future_versions"),
                    detected_stack=enriched.get("detected_stack"),
                    architecture_grade=enriched.get("architecture_grade"),
                    raw_analysis=result.get("overall_verdict", ""),
                )
                db.add(report)
            db.commit()

        return enriched

    def _format_report(self, data: dict, input_type: str = "code", input_url: str = None) -> dict:
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
                "maintainability": scores.get("maintainability", 50),
            },
            "future_versions": future_versions,
            "detected_stack": data.get("detected_stack", {}),
            "architecture_grade": data.get("architecture_grade", "B"),
            "raw_patterns": data.get("patterns", []),
            "raw_timeline": data.get("evolution_timeline", []),
            "raw_psychology": data.get("developer_psychology", {}),
            "quick_wins": data.get("quick_wins", []),
            "architectural_recommendations": data.get("architectural_recommendations", []),
            "overall_verdict": data.get("overall_verdict", ""),
        }
