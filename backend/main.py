from fastapi import FastAPI
from pydantic import BaseModel
from pipeline import Pipeline

app = FastAPI()
pipeline = Pipeline()

class FileRequest(BaseModel):
    file_path: str


@app.get("/health")
def health():
    return {"status": "Backend running"}

@app.post("/add-file")
def add_file(request: FileRequest):
    result = pipeline.add_file(request.file_path)
    return {"message": result}

@app.delete("/remove-file")
def remove_file(request: FileRequest):
    result = pipeline.remove_file(request.file_path)
    return {"message": result}

@app.get("/list-files")
def list_files():
    return {"files": pipeline.list_files()}