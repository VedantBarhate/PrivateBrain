import requests

class Generator:

    def __init__(self):
        self.url = "http://ollama:11434/api/generate"
        self.model = "llama3"

    def generate(self, prompt: str):

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(self.url, json=payload)
        response.raise_for_status()

        return response.json().get("response", "")