from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware # 1. Import the middleware
from pydantic import BaseModel
from pipeline import Pipeline
import shutil
import os

app = FastAPI()

# 2. Define the allowed origins (your frontend URLs)
origins = [
    "http://localhost:5173",
    "http://localhost:8000",
    # Add other frontend ports/domains here if needed
]

# 3. Add the middleware to your app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Allows requests from localhost:3000
    allow_credentials=True,
    allow_methods=["*"],         # Allows GET, POST, DELETE, etc.
    allow_headers=["*"],
)

pipeline = Pipeline()

UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/health")
def health():
    return {"status": "Backend running"}

@app.post("/add-file")
async def add_file(file: UploadFile = File(...)):
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    result = pipeline.add_file(file_location)

    return {"message": result}

@app.delete("/remove-file")
def remove_file(filename: str):
    file_location = f"{UPLOAD_DIR}/{filename}"
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    result = pipeline.remove_file(file_location)
    os.remove(file_location)

    return {"message": result}

@app.get("/list-files")
def list_files():
    return {"files": pipeline.list_files()}