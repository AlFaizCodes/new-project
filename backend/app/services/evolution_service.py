from sqlalchemy.orm import Session
from app.models.idea import Project, Idea
from app.agents.critic import CriticAgent
from app.agents.evolver import EvolverAgent
from app.agents.scorer import ScorerAgent
from app.agents.blueprint_architect import BlueprintArchitectAgent
from app.agents.ui_designer import UIDesignerAgent

critic_agent = CriticAgent()
evolver_agent = EvolverAgent()
scorer_agent = ScorerAgent()
blueprint_architect = BlueprintArchitectAgent()
ui_designer = UIDesignerAgent()

class EvolutionService:
    def run_critic(self, title: str, description: str, features: list = None, user_profile: dict = None) -> dict:
        return critic_agent.analyze(title, description, features, user_profile)

    def run_evolver(self, title: str, description: str, critic_report: dict, features: list = None, user_profile: dict = None, count: int = 5) -> list[dict]:
        return evolver_agent.evolve(title, description, critic_report, features, user_profile, count)

    def run_scorer(self, evolutions: list[dict], user_profile: dict = None) -> list[dict]:
        return scorer_agent.score_batch(evolutions, user_profile)

    def run_full_pipeline(self, title: str, description: str, features: list = None, user_profile: dict = None, count: int = 5) -> dict:
        # Step 1: Critic analysis
        critic_report = self.run_critic(title, description, features, user_profile)

        # Step 2: Generate evolved versions
        evolutions = self.run_evolver(title, description, critic_report, features, user_profile, count)

        # Step 3: Score each version
        scores = self.run_scorer(evolutions, user_profile)

        # Build tree structure
        nodes = [{"id": "root", "parentId": None, "title": title, "description": description, "score": scores[0].get("overall", 50) if scores else 50, "mutation_tag": "Original", "type": "original"}]
        edges = []
        for i, (ev, sc) in enumerate(zip(evolutions, scores)):
            node_id = f"v{i}"
            nodes.append({
                "id": node_id, "parentId": "root",
                "title": ev.get("version_name", f"Version {i+1}"),
                "description": ev.get("description", ""),
                "score": sc.get("overall", 70),
                "mutation_tag": ev.get("mutation_tag", "MUTATION"),
                "type": "evolved",
                "enhancements": ev.get("enhancements", []),
                "fixes": ev.get("fixes", []),
                "trade_offs": ev.get("trade_offs", []),
                "estimated_complexity": ev.get("estimated_complexity", "MEDIUM"),
                "scores": sc,
            })
            edges.append({"id": f"e{i}", "source": "root", "target": node_id, "label": ev.get("mutation_tag", ""), "animated": True})

        return {
            "critic_report": critic_report,
            "evolutions": evolutions,
            "scores": scores,
            "tree_data": {"nodes": nodes, "edges": edges},
        }

    def get_tree(self, db: Session, project_id: int) -> dict:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return None
        # Build from project ideas
        ideas = db.query(Idea).filter(Idea.project_id == project_id).all()
        if not ideas:
            return None

        nodes = [{"id": "root", "parentId": None, "title": project.title, "description": project.original_input, "score": 50, "mutation_tag": "Original", "type": "original"}]
        edges = []
        for i, idea in enumerate(ideas):
            node_id = f"idea_{idea.id}"
            nodes.append({
                "id": node_id, "parentId": "root",
                "title": idea.title, "description": idea.description or "",
                "score": idea.innovation_score or 50, "mutation_tag": idea.tags[0] if idea.tags else "Generated",
                "type": "evolved", "enhancements": idea.key_features or [],
            })
            edges.append({"id": f"e_idea_{i}", "source": "root", "target": node_id, "label": idea.tags[0] if idea.tags else "Generated", "animated": True})

        return {"tree_data": {"nodes": nodes, "edges": edges}, "project_id": project_id}

    def select_version(self, db: Session, project_id: int, version_id: str, version_data: dict) -> dict:
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            return None

        # Generate blueprint + mockup for selected version
        blueprint_data = blueprint_architect.generate(version_data)
        mockup_data = ui_designer.generate(version_data, blueprint_data)

        return {"blueprint": blueprint_data, "mockup": mockup_data}

    def evolve_further(self, db: Session, project_id: int, parent_tree_id: int, title: str, description: str, critic_report: dict, features: list = None, user_profile: dict = None, count: int = 5) -> dict:
        # Recursive evolution: run pipeline on the selected version
        return self.run_full_pipeline(title, description, features, user_profile, count)
