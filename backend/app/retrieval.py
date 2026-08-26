import numpy as np

from .gemini_config import GEMINI_EMBED_MODEL, client
from .knowledge import Document, build_documents

TOP_K = 3
MIN_SIMILARITY = 0.45


class VectorIndex:
    """In-memory embedding index over the portfolio knowledge base.

    Small enough (a few dozen chunks) that a persisted vector DB would be
    pure overhead — cosine similarity over a numpy matrix is exact and
    instant at this scale. Swap for Chroma/pgvector if the corpus grows.
    """

    def __init__(self, documents: list[Document]):
        self.documents = documents
        texts = [d.text for d in documents]
        response = client.models.embed_content(model=GEMINI_EMBED_MODEL, contents=texts)
        matrix = np.array([e.values for e in response.embeddings], dtype=np.float32)
        self.matrix = matrix / np.linalg.norm(matrix, axis=1, keepdims=True)

    def search(self, query: str, k: int = TOP_K, min_similarity: float = MIN_SIMILARITY):
        response = client.models.embed_content(model=GEMINI_EMBED_MODEL, contents=[query])
        q = np.array(response.embeddings[0].values, dtype=np.float32)
        q = q / np.linalg.norm(q)
        scores = self.matrix @ q
        ranked = np.argsort(-scores)[:k]
        return [
            (self.documents[i], float(scores[i]))
            for i in ranked
            if scores[i] >= min_similarity
        ]


_index: VectorIndex | None = None


def get_index() -> VectorIndex:
    global _index
    if _index is None:
        _index = VectorIndex(build_documents())
    return _index
