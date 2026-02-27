from typing import List, Dict
import chromadb
from embedder import Embedder

class Retriever:
    def __init__(self, collection_name="documents", score_threshold=0.4):
        self.client = chromadb.HttpClient(host="chroma", port=8000)
        self.collection = self.client.get_or_create_collection(collection_name)
        self.embedder = Embedder()
        self.score_threshold = score_threshold

    def retrieve(self, query: str, top_k=5) -> List[Dict]:
        query_embedding = self.embedder.generate_embeddings([query])[0]

        results = self.collection.query(
            query_embeddings=[query_embedding.tolist()],
            n_results=top_k
        )

        documents = results["documents"][0]
        distances = results["distances"][0]

        formatted = []
        for doc, score in zip(documents, distances):
            if score >= self.score_threshold:
                formatted.append({
                    "text": doc,
                    "score": score
                })

        return formatted