FROM ollama/ollama:latest

ENV OLLAMA_MODELS=/root/.ollama/models

RUN ollama serve & \
    sleep 5 && \
    ollama pull phi && \
    ollama pull gemma:2b && \
    pkill ollama

EXPOSE 11434

CMD ["ollama", "serve"]