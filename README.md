<div align="center">

# 🧠 PrivateBrain

### Offline AI Knowledge System using Containers

*Chat with your documents using a local LLM. Your data never leaves your machine.*

![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black)
![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector%20DB-green)
![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-black)
![Prometheus](https://img.shields.io/badge/Prometheus-Monitoring-E6522C?logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-Dashboards-F46800?logo=grafana&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)

</div>

---

## 📑 Table of Contents

- [About](#-about)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [Docker Commands Reference](#-docker-commands-reference)
- [Monitoring](#-monitoring--observability)
- [CI/CD](#-cicd-pipeline)
- [Security](#-security)
- [Image Optimization](#-image-optimization)
- [Roadmap](#-roadmap)
- [Team](#-team)

---

## 📖 About

**PrivateBrain** is a fully containerized, offline **Retrieval-Augmented Generation (RAG)** system. Users upload their own documents (PDF, DOCX, TXT), the system converts them into vector embeddings, stores them in a local vector database, and answers questions about them using a locally hosted LLM, all without sending a single byte to the cloud.

> *"The best way to protect sensitive data is to ensure it never leaves your local environment."*
> — Core philosophy of Private AI

The project is built as a practical demonstration of container-based application development and orchestration: Docker networking, volumes, multi-stage builds, Docker Compose, monitoring, and CI/CD.

---

## 🎯 Problem Statement

Most AI tools require users to upload private data (reports, contracts, research papers, code) to cloud platforms such as OpenAI or Google. This leads to:

| Issue | Impact |
|---|---|
| 🔓 Data privacy risk | Sensitive data leaves the organization |
| 🏢 Compliance violations | GDPR / HIPAA legal barriers |
| 🌐 Internet dependency | No AI without connectivity |
| 💰 Ongoing API cost | Pay-per-token billing |
| ❌ No infrastructure control | Vendor lock-in |

**PrivateBrain's answer:** a secure, offline, portable AI system that understands your documents without sending data to the cloud.

---

## ✨ Key Features

- 🤖 **Local LLM**: Ollama running Llama 3 / Mistral entirely offline
- 📄 **Multi-format ingestion**: PDF, DOCX and TXT documents
- 🔍 **Semantic search**: ChromaDB vector embeddings (`all-MiniLM-L6-v2`)
- 🔒 **100% private**: no data ever leaves your machine
- 📴 **Works offline**: fully air-gapped after the initial model pull
- 💾 **Persistent storage**: Docker volumes keep embeddings and models across restarts
- 📊 **Observability**: Prometheus, Grafana and cAdvisor dashboards
- 🚀 **CI/CD ready**: GitHub Actions builds the images automatically
- 🛡️ **Supply-chain security**: images scanned with Trivy and signed with Cosign
- 📦 **Fully containerized**: 7 microservices launched with a single command

---

## 🏗️ Architecture

```
                         ┌────────────────────┐
                         │   User (Browser)   │
                         └─────────┬──────────┘
                                   │ HTTP
                         ┌─────────▼──────────┐
                         │  Frontend (React)  │  :5173
                         └─────────┬──────────┘
                                   │ REST API
              ┌────────────────────┴────────────────────┐
              │                                         │
   ┌──────────▼───────────┐                  ┌──────────▼───────────┐
   │ Backend (FastAPI)    │                  │ RAG Orchestrator     │
   │ Ingestion + Embedding│                  │ (FastAPI + LangChain)│
   └──────────┬───────────┘                  └───────┬──────────┬───┘
              │ store vectors          similarity    │          │ prompt + chunks
              │                        search       │          │
              │         ┌──────────────────┐         │   ┌──────▼───────────┐
              └────────►│ ChromaDB         │◄────────┘   │ Ollama (Local LLM)│
                        │ Vector Database  │             └──────┬───────────┘
                        └────────┬─────────┘                    │
                                 │                              │
                        [chroma_data volume]            [ollama_models volume]

        cAdvisor ──► Prometheus ──► Grafana      (container metrics & dashboards)
```

### How it works

1. **Ingest:** the user uploads documents through the UI → the **Backend** extracts text, splits it into chunks and generates embeddings.
2. **Store:** vectors and metadata are saved in **ChromaDB** (persisted in a Docker volume).
3. **Query:** the user asks a question → the **RAG service** embeds it and runs a similarity search in ChromaDB.
4. **Generate:** the top chunks plus the question are sent as a prompt to **Ollama**, which generates a grounded answer.
5. **Respond:** the answer is returned as JSON and displayed in the chat interface.

### Services

| Service | Image | Role | Port |
|---|---|---|---|
| `frontend` | `pvtbrain_frontend` | React (Vite) UI served via Nginx | `5173 → 80` |
| `backend` | `pvtbrain_backend` | Document ingestion, chunking, embeddings (FastAPI) | `8000` |
| `rag` | `pvtbrain_rag` | RAG orchestration (LangChain + FastAPI) | see `docker-compose.yml` |
| `chroma` | `pvtbrain_chromadb` | Vector database | `8001 → 8000` |
| `ollama` | `pvtbrain_ollama` | Local LLM inference engine | `11434` |
| `prometheus` | `prom/prometheus` | Metrics scraper | `9090` |
| `grafana` | `grafana/grafana` | Dashboards | `3000` |
| `cadvisor` | `cadvisor` | Container-level metrics | `8080` |

All services communicate over a private Docker bridge network: **`pvtbrain-network`**.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Nginx |
| Backend / RAG | Python 3.11, FastAPI, Uvicorn, LangChain |
| Embeddings | Sentence Transformers (`all-MiniLM-L6-v2`), PyTorch 2.4.1 |
| Vector DB | ChromaDB |
| LLM runtime | Ollama (Llama 3 / Mistral) |
| Containers | Docker, Docker Compose (Swarm stack file included) |
| Monitoring | Prometheus, Grafana, cAdvisor |
| CI/CD | GitHub Actions |
| Security | Trivy, Cosign |

---

## 📁 Project Structure

```
PrivateBrain/
├── .github/workflows/     # GitHub Actions CI/CD pipeline
├── backend/               # FastAPI ingestion + embedding service
├── RAG/                   # RAG orchestrator (retrieval + LLM calls)
├── chromadb/              # ChromaDB Dockerfile
├── ollama/                # Ollama Dockerfile
├── frontend/              # React + Vite UI (served by Nginx)
├── prometheus/            # Prometheus scrape configuration
├── docker-compose.yml     # Multi-container orchestration
├── docker-stack.yml       # Docker Swarm stack definition
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine + Compose plugin)
- **~10 GB** free disk space (images + models)
- **8 GB+ RAM** recommended (a 7 GB allocation to Docker was used during development)
- *(Optional)* NVIDIA GPU + container toolkit for faster inference. The system falls back to CPU automatically.
- Internet access **only once**, to pull base images and the LLM model

### 1. Clone the repository

```bash
git clone https://github.com/VedantBarhate/PrivateBrain.git
cd PrivateBrain
```

### 2. Start the full stack

```bash
docker compose up -d --build
```

> The first backend build is slow (PyTorch and the embedding model are downloaded and baked into the image). Later builds use the layer cache.

### 3. Pull an LLM into Ollama (one-time)

```bash
docker exec -it ollama ollama pull llama3
# or
docker exec -it ollama ollama pull mistral
```

The model is stored in the `ollama_models` volume, so this is only needed once. After that the system runs fully offline.

### 4. Open the app

| Interface | URL |
|---|---|
| 💬 PrivateBrain UI | http://localhost:5173 |
| 📘 Backend API docs (Swagger) | http://localhost:8000/docs |
| 📈 Grafana | http://localhost:3000 |
| 🔥 Prometheus | http://localhost:9090 |
| 📦 cAdvisor | http://localhost:8080 |

> Port mappings may differ slightly; check `docker-compose.yml` for the authoritative values.

### 5. Stop the stack

```bash
docker compose down        # stop containers (data is kept in volumes)
docker compose down -v     # stop AND delete volumes (wipes embeddings & models)
```

---

## 💡 Usage

1. Open **http://localhost:5173**.
2. Drag and drop up to **5 files** (`.pdf`, `.docx`, `.txt`) into the **Documents** panel.
3. Wait for ingestion to finish. Your files appear in the sidebar.
4. Ask questions in the chat box, for example:
   > *"Summarize this document in 40 words."*
5. Remove a document anytime with the 🗑️ icon. It is also removed from the vector store.

### Backend API (selected endpoints)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/add-file` | Upload and ingest a document |
| `GET` | `/list-files` | List ingested documents |
| `POST` | `/chat` | Ask a question (RAG service) |
| `GET` | `/docs` | Interactive Swagger UI |

---

## 🐳 Docker Commands Reference

<details>
<summary><b>Run services manually (without Compose)</b></summary>

```bash
# Build images
docker build -t pvtbrain_backend:v1.2 ./backend
docker build -t pvtbrain_chromadb:v1.0 ./chromadb

# Create the private network
docker network create pvtbrain-network

# Run ChromaDB (with persistent volume)
docker run --name chroma --network pvtbrain-network \
  -v chroma_data:/data -p 8001:8000 pvtbrain_chromadb:v1.0

# Run Backend
docker run --name pb_backend --network pvtbrain-network \
  -p 8000:8000 pvtbrain_backend:v1.2

# Run Ollama (with persistent model volume)
docker run --name ollama --network pvtbrain-network \
  -p 11434:11434 -v pvtbrain_ollama-data:/root/.ollama pvtbrain_ollama:v1.0

# Run Frontend
docker run --name frontend --network pvtbrain-network \
  -p 5173:80 pvtbrain_frontend:v1.0
```

</details>

<details>
<summary><b>Debugging & maintenance</b></summary>

```bash
docker ps -a                              # list all containers
docker logs -f <container>                # follow logs
docker inspect <container>                # inspect config / resources
docker exec -it <container> /bin/bash     # shell into a container
docker network inspect pvtbrain-network   # check network membership
docker stop backend chroma                # stop containers
docker rm <container_id>                  # remove a container
docker rmi <image>:<tag>                  # remove an image
```

</details>

<details>
<summary><b>Publish / pull images from Docker Hub</b></summary>

```bash
docker tag pvtbrain_chromadb:v1.0 <your-username>/pvtbrain_chromadb:v1.0
docker push <your-username>/pvtbrain_chromadb:v1.0
docker pull <your-username>/pvtbrain_chromadb:v1.0
```

</details>

---

## 📊 Monitoring & Observability

PrivateBrain ships with a ready-made monitoring stack:

- **cAdvisor** collects container-level CPU, memory and network metrics.
- **Prometheus** scrapes cAdvisor, the Backend, ChromaDB and Ollama (config in `prometheus/`).
- **Grafana** visualizes everything in dashboards, which is useful for watching hardware stress during heavy RAG queries.

To get started in Grafana, open http://localhost:3000 and add Prometheus as a data source (`http://prometheus:9090`).

---

## 🔄 CI/CD Pipeline

A **GitHub Actions** workflow (`.github/workflows/`) automatically:

1. Triggers on every push.
2. Builds the Docker images.
3. Tests the build.
4. Publishes the images to the registry.

This ensures reproducible, consistent builds across every team member's machine.

---

## 🛡️ Security

- **Network isolation:** Backend, ChromaDB and Ollama communicate only through `pvtbrain-network`, so no document data is exposed externally.
- **Vulnerability scanning:** every image is scanned with [Trivy](https://trivy.dev):

  ```bash
  trivy image <image>:<tag>
  ```

  | Image | Base OS | Total findings* |
  |---|---|---|
  | `chromadb` | Debian 13.4 | 127 (5 High, 0 Critical) |
  | `ollama` | Wolfi + Go binary | 36 (8 High, 1 Critical) |
  | `rag` | Debian 12.13 | 155 (OS packages) |
  | `frontend` | Alpine 3.23.3 | 2 (1 High, 1 Medium) |

  <sub>*Snapshot from the April 2026 scans; counts change as advisories are published. Re-scan regularly.</sub>

- **Image signing:** images are signed and verified with [Cosign](https://github.com/sigstore/cosign):

  ```bash
  cosign sign   --key cosign.key <registry>/<image>:<tag>
  cosign verify --key cosign.pub <registry>/<image>:<tag>
  ```

  > ⚠️ Never commit `cosign.key`. Only `cosign.pub` should be shared. Prefer signing by digest rather than tag.

---

## ⚡ Image Optimization

The backend image originally reached **~10 GB**. After optimization it is **~6.3 GB**.

| Problem | Fix |
|---|---|
| CUDA PyTorch + duplicate `torch` installs | Unified pip install with `--extra-index-url` |
| Unused `torchvision` / `torchaudio` | Removed |
| Full `chromadb` package | Switched to `chromadb-client` |
| Huge build context | Added `.dockerignore` |
| Bloated layers | Multi-stage build + `--no-cache-dir` |

**Backend Dockerfile (multi-stage):**

- **Stage 1 (builder):** `python:3.11-slim`, installs `gcc` / `build-essential`, then PyTorch and `requirements.txt` into `/install/deps`.
- **Stage 2 (runtime):** clean `python:3.11-slim`, copies only `/install/deps`, pre-downloads the `all-MiniLM-L6-v2` embedding model, copies the source and runs `uvicorn` on port `8000`.


---

<div align="center">

**Built with 🐳 Docker, so your data stays yours.**

</div>
