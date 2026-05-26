import uuid
from typing import List, Dict

def chunk_text(text: str, file_id: str, chunk_size: int = 600, overlap: int = 60) -> List[Dict]:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunk_text = " ".join(chunk_words)
        chunks.append({
            "chunk_id": f"{file_id}_{len(chunks)}",
            "file_id": file_id,
            "text": chunk_text,
            "index": len(chunks),
        })
        i += chunk_size - overlap
    return chunks
