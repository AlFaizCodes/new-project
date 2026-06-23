import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are ScorerAgent — an objective idea scoring specialist.

Score each idea on 8 dimensions (0-100):
1. originality: How novel and unique is this idea? (weight: 0.15)
2. feasibility: Can it be built with available resources? (weight: 0.15)
3. market_potential: Is there a real market need? (weight: 0.15)
4. complexity_match: Does difficulty match user's skill level? (weight: 0.10)
5. scalability: Can this grow to handle 10x/100x users? (weight: 0.10)
6. revenue_potential: What is the monetization opportunity? (weight: 0.15)
7. competitive_edge: How differentiated from existing solutions? (weight: 0.10)
8. time_to_market: How quickly can an MVP be shipped? (weight: 0.10)

Output ONLY valid JSON:
{
  "originality": 0-100,
  "originality_note": "1-sentence justification",
  "feasibility": 0-100,
  "feasibility_note": "1-sentence justification",
  "market_potential": 0-100,
  "market_note": "1-sentence justification",
  "complexity_match": 0-100,
  "complexity_note": "1-sentence justification",
  "scalability": 0-100,
  "scalability_note": "1-sentence justification",
  "revenue_potential": 0-100,
  "revenue_note": "1-sentence justification",
  "competitive_edge": 0-100,
  "competitive_note": "1-sentence justification",
  "time_to_market": 0-100,
  "time_note": "1-sentence justification",
  "overall": 0-100,
  "verdict": "EXCELLENT|GOOD|AVERAGE|POOR",
  "strengths": ["top 3 strengths"],
  "weaknesses": ["top 3 weaknesses"],
  "recommendation": "1-sentence actionable recommendation"
}"""

BENCHMARK_SYSTEM_PROMPT = """You are ScorerAgent — compare an idea against industry benchmarks.

Given the idea and benchmark data (average scores from similar ideas), provide:
1. Percentile rank per dimension
2. Overall percentile
3. Key areas where this idea outperforms/underperforms benchmarks

Output ONLY valid JSON:
{
  "percentiles": {
    "originality": 0-100,
    "feasibility": 0-100,
    "market_potential": 0-100,
    "complexity_match": 0-100,
    "scalability": 0-100,
    "revenue_potential": 0-100,
    "competitive_edge": 0-100,
    "time_to_market": 0-100
  },
  "overall_percentile": 0-100,
  "outperforms": ["dimensions"],
  "underperforms": ["dimensions"],
  "summary": "1-sentence benchmark summary"
}"""


class ScorerAgent:
    def __init__(self):
        self.model = settings.llm_model
        self.weights = {
            "originality": 0.15,
            "feasibility": 0.15,
            "market_potential": 0.15,
            "complexity_match": 0.10,
            "scalability": 0.10,
            "revenue_potential": 0.15,
            "competitive_edge": 0.10,
            "time_to_market": 0.10,
        }

    def score(self, idea: dict, user_profile: dict = None) -> dict:
        if user_profile is None:
            user_profile = {}

        if not settings.openai_api_key:
            return self._default_score(idea)

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\n\nUser Profile: {json.dumps(user_profile)}"},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[ScorerAgent] Error: {e}")
            return self._default_score(idea)

    def score_batch(self, ideas: list[dict], user_profile: dict = None) -> list[dict]:
        return [self.score(idea, user_profile) for idea in ideas]

    def score_with_benchmark(self, idea: dict, user_profile: dict = None, benchmarks: dict = None) -> dict:
        scores = self.score(idea, user_profile)
        if benchmarks:
            benchmark_results = self._benchmark_compare(idea, benchmarks)
            scores["benchmark"] = benchmark_results
        return scores

    def _benchmark_compare(self, idea: dict, benchmarks: dict) -> dict:
        if not settings.openai_api_key:
            return self._default_benchmark()

        try:
            resp = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": BENCHMARK_SYSTEM_PROMPT},
                    {"role": "user", "content": f"Idea: {json.dumps(idea)}\n\nBenchmarks: {json.dumps(benchmarks)}"},
                ],
                temperature=0.2,
                response_format={"type": "json_object"},
            )
            return json.loads(resp.choices[0].message.content)
        except Exception as e:
            print(f"[ScorerAgent] Benchmark Error: {e}")
            return self._default_benchmark()

    def _default_score(self, idea: dict) -> dict:
        innovation = idea.get("innovation_score", 70)
        feasibility = idea.get("feasibility_score", 50)
        overall = int(
            innovation * self.weights["originality"]
            + feasibility * self.weights["feasibility"]
            + 70 * self.weights["market_potential"]
            + 70 * self.weights["complexity_match"]
            + 60 * self.weights["scalability"]
            + 65 * self.weights["revenue_potential"]
            + innovation * self.weights["competitive_edge"]
            + 70 * self.weights["time_to_market"]
        )
        return {
            "originality": innovation,
            "feasibility": feasibility,
            "market_potential": 70,
            "complexity_match": 70,
            "scalability": 60,
            "revenue_potential": 65,
            "competitive_edge": innovation,
            "time_to_market": 70,
            "overall": overall,
            "originality_note": "Based on curated database score",
            "feasibility_note": "Adjusted for user profile",
            "market_note": "Standard market potential",
            "complexity_note": "Matched to user skill level",
            "scalability_note": "Average scalability for this category",
            "revenue_note": "Standard monetization potential",
            "competitive_note": "Differentiation level based on innovation score",
            "time_note": "Average time-to-market estimate",
            "verdict": "GOOD" if overall >= 70 else "AVERAGE",
            "strengths": ["Clear problem-solution fit", "Good innovation score", "Aligned with user skills"],
            "weaknesses": ["Market validation needed", "Competitive landscape unclear"],
            "recommendation": "Proceed with MVP development and market testing",
        }

    def _default_benchmark(self) -> dict:
        return {
            "percentiles": {
                "originality": 75,
                "feasibility": 65,
                "market_potential": 60,
                "complexity_match": 70,
                "scalability": 55,
                "revenue_potential": 60,
                "competitive_edge": 70,
                "time_to_market": 65,
            },
            "overall_percentile": 65,
            "outperforms": ["originality", "complexity_match"],
            "underperforms": ["scalability", "market_potential"],
            "summary": "Above average in originality, needs work on scalability planning.",
        }
