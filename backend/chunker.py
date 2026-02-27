from langchain_text_splitters import RecursiveCharacterTextSplitter

class Chunker:
    def __init__(self, size=500, overlap=50):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=size,
            chunk_overlap=overlap
        )

    def chunk(self, text: str, document_id: str):
        chunks = self.splitter.split_text(text)
        structured_chunks = []
        for index, chunk in enumerate(chunks):
            structured_chunks.append({
                "document_id": document_id,
                "chunk_order": index,
                "text": chunk
            })
            
        return structured_chunks