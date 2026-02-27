from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import RAGPipeline

app = FastAPI()
pipeline = RAGPipeline()


class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health():
    return {"status": "RAG service running"}

@app.post("/chat")
def chat(request: QueryRequest):
    result = pipeline.query(request.query)
    return result