import torch
from sentence_transformers import SentenceTransformer


class Embedder:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device (for embedding): {self.device}")

        self.model = SentenceTransformer("all-MiniLM-L6-v2", device=self.device)

    def embed(self, chunks):
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.model.encode(texts, device=self.device, show_progress_bar=False)
        for chunk, embedding in zip(chunks, embeddings):
            chunk["embedding"] = embedding.tolist()

        return chunks