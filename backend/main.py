from fastapi import FastAPI, UploadFile, File, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from fastapi.responses import StreamingResponse # type: ignore
from pydantic import BaseModel # type: ignore
import uvicorn, uuid, json, asyncio # type: ignore

from parser_module import parse_file
from chunker import chunk_text
from embedder import embed_and_store, retrieve_chunks
from insight_engine import generate_summary, generate_charts, ask_question, get_provider_status
from store import save_file_meta, get_file_meta, list_files

app = FastAPI(title="MoGenAI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

class QuestionRequest(BaseModel):
    file_id: str
    question: str

@app.get("/")
def root():
    return {"status": "MoGenAI backend running", "version": "1.0.0"}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
        text, row_count = parse_file(file.filename, content)
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from file")
        file_id = str(uuid.uuid4())[:8]
        chunks = chunk_text(text, file_id)
        embed_and_store(file_id, chunks)
        summary = generate_summary(text, file.filename)
        charts = generate_charts(text, file.filename)
        meta = {"file_id": file_id, "filename": file.filename, "chars": len(text),
                "chunks": len(chunks), "rows": row_count, "summary": summary, "charts": charts}
        save_file_meta(file_id, meta)
        return meta
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/files")
def get_files():
    return list_files()

@app.get("/api/summary/{file_id}")
def get_summary(file_id: str):
    meta = get_file_meta(file_id)
    if not meta:
        raise HTTPException(status_code=404, detail="File not found")
    return meta

@app.post("/api/ask")
def ask(req: QuestionRequest):
    meta = get_file_meta(req.file_id)
    if not meta:
        raise HTTPException(status_code=404, detail="File not found")
    chunks, metas = retrieve_chunks(req.file_id, req.question)
    answer, sources = ask_question(chunks, req.question)
    return {"answer": answer, "sources": sources, "question": req.question}

@app.get("/api/status")
def provider_status():
    """Returns real-time AI provider health — useful for monitoring during demo."""
    status = get_provider_status()
    active = next((name for name, info in status.items() if info["available"]), "none")
    return {"active_provider": active, "providers": status}

