FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HF_HOME=/app/model_cache

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip && \
    -r requirements.txt

# Download model once at build time, baked into image
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

COPY . .

EXPOSE 8001
CMD ["uvicorn", "rag_api:app", "--host", "0.0.0.0", "--port", "8001"]