import chromadb

class VectorClient:
    def __init__(self):
        self.client = chromadb.HttpClient(host="chroma", port=8000)
        self.collection = self.client.get_or_create_collection("documents")

    def store_chunks(self, chunks):
        ids = []
        documents = []
        embeddings = []

        for chunk in chunks:
            ids.append(f"{chunk['document_id']}_{chunk['chunk_order']}")
            documents.append(chunk["text"])
            embeddings.append(chunk["embedding"])

        self.collection.add(
            ids=ids,
            documents=documents,
            embeddings=embeddings
        )

    def delete_file(self, document_id):
        self.collection.delete(
            where={"document_id": document_id}
        )