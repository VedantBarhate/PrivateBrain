import requests

class Generator:

    def __init__(self):
        self.url = "http://localhost:11434/api/generate"
        self.model = "gemma:2b"

    def generate(self, prompt: str):

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(self.url, json=payload)
        response.raise_for_status()

        return response.json().get("response", "")
    
if __name__ == "__main__":
    g = Generator()
    x = g.generate("What is AI, in 2 line?")
    print(x)