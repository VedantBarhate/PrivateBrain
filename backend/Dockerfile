# -----------------------
# Stage 1 — Builder
# -----------------------
FROM python:3.11-slim AS builder

WORKDIR /install

# Install system dependencies required for PyMuPDF
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first (layer caching)
COPY requirements.txt .

# Install Python dependencies to custom directory
RUN pip install --upgrade pip
RUN pip install --prefix=/install/deps torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
RUN pip install --prefix=/install/deps -r requirements.txt


# -----------------------
# Stage 2 — Runtime
# -----------------------
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy installed dependencies from builder stage
COPY --from=builder /install/deps /usr/local

# Copy application code
COPY . .

# Expose API port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]