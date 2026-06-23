import numpy as np
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.openai_api_key)

class EmbeddingGenerator:
    def __init__(self):
        self.model = settings.embedding_model

    def generate(self, text: str) -> list[float]:
        if not settings.openai_api_key:
            return [0.0] * 1536
        try:
            resp = client.embeddings.create(input=text, model=self.model)
            return resp.data[0].embedding
        except Exception as e:
            print(f"[Embedding] Error: {e}")
            return [0.0] * 1536

    def generate_batch(self, texts: list[str]) -> list[list[float]]:
        if not settings.openai_api_key:
            return [[0.0] * 1536 for _ in texts]
        try:
            resp = client.embeddings.create(input=texts, model=self.model)
            sorted_resp = sorted(resp.data, key=lambda x: x.index)
            return [r.embedding for r in sorted_resp]
        except Exception as e:
            print(f"[Embedding] Batch error: {e}")
            return [[0.0] * 1536 for _ in texts]
