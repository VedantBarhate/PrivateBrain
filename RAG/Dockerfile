# ---- Stage 1: Download model ----
FROM python:3.11-slim-bookworm AS model-downloader

RUN pip install --no-cache-dir fastembed==0.4.2

# Set cache path to a predictable location (not /tmp which varies)
ENV FASTEMBED_CACHE_PATH=/fastembed_cache

RUN python -c "from fastembed import TextEmbedding; TextEmbedding('BAAI/bge-small-en-v1.5')"

# ---- Stage 2: Runtime ----
FROM python:3.11-slim-bookworm AS runtime

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FASTEMBED_CACHE_PATH=/app/model_cache

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy from the explicit path we set in stage 1
COPY --from=model-downloader /fastembed_cache /app/model_cache

COPY . .

EXPOSE 8001

CMD ["uvicorn", "rag_api:app", "--host", "0.0.0.0", "--port", "8001"]