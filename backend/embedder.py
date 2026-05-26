import os, json
from typing import List, Dict, Tuple
import chromadb
from chromadb.utils import embedding_functions

CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
_client = None
_collection = None

def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=CHROMA_PATH)
        ef = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        _collection = _client.get_or_create_collection("mogenai", embedding_function=ef)
    return _collection

def embed_and_store(file_id: str, chunks: List[Dict]):
    col = get_collection()
    ids = [c["chunk_id"] for c in chunks]
    docs = [c["text"] for c in chunks]
    metas = [{"file_id": c["file_id"], "index": c["index"]} for c in chunks]
    # Store in batches of 50
    for i in range(0, len(ids), 50):
        col.add(ids=ids[i:i+50], documents=docs[i:i+50], metadatas=metas[i:i+50])

def retrieve_chunks(file_id: str, question: str, k: int = 5) -> Tuple[List[str], List[Dict]]:
    col = get_collection()
    try:
        results = col.query(query_texts=[question], n_results=k, where={"file_id": file_id})
        docs = results["documents"][0] if results["documents"] else []
        metas = results["metadatas"][0] if results["metadatas"] else []
        return docs, metas
    except Exception:
        return [], []
