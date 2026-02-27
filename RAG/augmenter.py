from typing import List, Dict

class Augmenter:
    def __init__(self, max_tokens=4000):
        self.max_tokens = max_tokens

    def augment(self, query: str, retrieved_chunks: List[Dict]) -> Dict:

        if not retrieved_chunks:
            return {
                "query": query,
                "context": "",
                "sources": []
            }

        context = []
        sources = []

        for chunk in retrieved_chunks:
            context.append(chunk["text"])
            sources.append({
                "score": chunk["score"]
            })

        return {
            "query": query,
            "context": "\n\n".join(context),
            "sources": sources
        }