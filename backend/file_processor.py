import os
import fitz

class FileProcessor:
    def extract_text(self, file_path: str):
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".txt":
            return self._extract_txt(file_path)
        elif ext == ".pdf":
            return self._extract_pdf(file_path)
        else:
            raise ValueError("Only PDF and TXT supported")

    def _extract_txt(self, path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def _extract_pdf(self, path):
        text = []
        with fitz.open(path) as pdf:
            for page in pdf:
                text.append(page.get_text())
        return "\n".join(text)