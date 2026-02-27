
from sentence_transformers import SentenceTransformer

class Embedder:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def generate_embeddings(self, texts):
        embeddings = self.model.encode(
            texts,
            device=self.device,
            show_progress_bar=False
        )
        return embeddings