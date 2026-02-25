import os
from file_processor import FileProcessor
from chunker import Chunker
from embedder import Embedder
from vector_client import VectorClient

class Pipeline:
    def __init__(self):
        self.processor = FileProcessor()
        self.chunker = Chunker()
        self.embedder = Embedder()
        self.vector = VectorClient()
        self.active_documents = set()

    def add_file(self, file_path):
        if not os.path.exists(file_path):
            return "File not found"
        file_name = os.path.basename(file_path)
        try:
            text = self.processor.extract_text(file_path)
            chunks = self.chunker.chunk(text, file_name)
            enriched = self.embedder.embed(chunks)
            self.vector.store_chunks(enriched)
            self.active_documents.add(file_name)

            return f"{file_name} added successfully"

        except Exception as e:
            return f"Error adding file: {e}"

    def remove_file(self, file_path):
        file_name = os.path.basename(file_path)

        try:
            self.vector.delete_file(file_name)
            self.active_documents.discard(file_name)

            return f"{file_name} removed successfully"

        except Exception as e:
            return f"Error removing file: {e}"

    def list_files(self):
        return list(self.active_documents)