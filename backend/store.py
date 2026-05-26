import json, os
from typing import Dict, List, Optional

STORE_PATH = "./data_store.json"

def _load() -> Dict:
    if os.path.exists(STORE_PATH):
        with open(STORE_PATH, "r") as f:
            return json.load(f)
    return {}

def _save(data: Dict):
    with open(STORE_PATH, "w") as f:
        json.dump(data, f, indent=2)

def save_file_meta(file_id: str, meta: Dict):
    data = _load()
    data[file_id] = meta
    _save(data)

def get_file_meta(file_id: str) -> Optional[Dict]:
    data = _load()
    return data.get(file_id)

def list_files() -> List[Dict]:
    data = _load()
    return [{"file_id": k, "filename": v.get("filename", "unknown"),
             "rows": v.get("rows", 0), "chunks": v.get("chunks", 0)} for k, v in data.items()]
