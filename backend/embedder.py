from sentence_transformers import SentenceTransformer


class Embedder:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    def embed(self, chunks):
        texts = [chunk["text"] for chunk in chunks]
        embeddings = self.model.encode(texts)
        for chunk, embedding in zip(chunks, embeddings):
            chunk["embedding"] = embedding.tolist()

        return chunks