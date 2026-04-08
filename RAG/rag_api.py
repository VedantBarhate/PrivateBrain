from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 1. Import the middleware
from pydantic import BaseModel
from pipeline import RAGPipeline

app = FastAPI()

# 2. Define the allowed origins (your frontend URLs)
origins = [
    "http://localhost:5173"
]

# 3. Add the middleware to your app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allows requests from the URLs listed above
    allow_credentials=True,      # Allows cookies/authentication headers
    allow_methods=["*"],         # Allows all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],         # Allows all headers
)

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