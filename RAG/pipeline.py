from retriever import Retriever
from augmenter import Augmenter
from generator import Generator

class RAGPipeline:
    def __init__(self):
        self.retriever = Retriever()
        self.augmenter = Augmenter()
        self.generator = Generator()

    def query(self, user_query: str):
        retrieved_chunks = self.retriever.retrieve(user_query)

        augmented = self.augmenter.augment(user_query, retrieved_chunks)

        return self.generator.generate(
            prompt=augmented
        )