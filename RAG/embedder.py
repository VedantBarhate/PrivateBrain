from fastembed import TextEmbedding

class Embedder:
    def __init__(self, model_name="BAAI/bge-small-en-v1.5"):
        self.model = TextEmbedding(model_name)

    def generate_embeddings(self, texts):
        embeddings = list(self.model.embed(texts))
        return embeddings