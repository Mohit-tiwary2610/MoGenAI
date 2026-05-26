# MoGenAI — Technical Documentation
## FlowZint AI Hackathon 2026 | Open Innovation | Mohit Tiwary

---

## System Overview

MoGenAI is a full-stack AI Business Intelligence platform. It accepts any business file, processes it through a Retrieval-Augmented Generation (RAG) pipeline, and exposes the intelligence through:
- Auto-generated dashboards and KPI cards
- Plain-English AI summaries with risk analysis
- A conversational Q&A interface with cited, source-traceable answers

---

## API Endpoints

### POST /api/upload
Upload a file and trigger AI analysis.

**Request:** `multipart/form-data` with field `file`  
**Supported types:** `.csv`, `.pdf`, `.docx`, `.json`, `.txt`  
**Max size:** 10 MB

**Response:**
```json
{
  "file_id": "a1b2c3d4",
  "filename": "sales_data.csv",
  "chars": 12400,
  "chunks": 24,
  "rows": 150,
  "summary": {
    "headline": "...",
    "key_metrics": [...],
    "top_insight": "...",
    "risk": "...",
    "suggested_questions": [...]
  },
  "charts": [...]
}
```

### POST /api/ask
Ask a natural language question about an uploaded file.

**Request:**
```json
{ "file_id": "a1b2c3d4", "question": "Which product had the highest revenue?" }
```

**Response:**
```json
{
  "answer": "SmartWatch Pro had the highest revenue at ₹5.98L in May 2026...",
  "sources": ["1", "3", "7"],
  "question": "Which product had the highest revenue?"
}
```

### GET /api/summary/{file_id}
Returns the full metadata, summary, and chart data for a previously uploaded file.

### GET /api/files
Returns a list of all uploaded files in the current session.

---

## AI Pipeline (RAG)

```
File uploaded
     │
     ▼
parser_module.py
  CSV → pandas   │  PDF → PyMuPDF   │  DOCX → python-docx
     │
     ▼
chunker.py
  RecursiveCharacterTextSplitter (chunk_size=600, overlap=60)
  Each chunk tagged with file_id and index
     │
     ▼
embedder.py
  SentenceTransformers all-MiniLM-L6-v2 (local, free)
  Vectors stored in ChromaDB (persistent)
     │
  ┌──┴──────────────────────────────┐
  │ On question received:           │
  │  1. Embed question              │
  │  2. Query ChromaDB (top-5)      │
  │  3. Build prompt with chunks    │
  │  4. Call Claude Haiku           │
  │  5. Parse answer + sources      │
  └─────────────────────────────────┘
     │
     ▼
insight_engine.py
  Returns: answer string + source chunk IDs
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Claude API key from console.anthropic.com |
| `CHROMA_PATH` | No | Path for ChromaDB storage (default: `./chroma_db`) |

---

## Free API Usage

| Service | Cost | Limit |
|---|---|---|
| Anthropic Claude Haiku | Free tier | 1M tokens/month, 5 req/min |
| SentenceTransformers | Free (local) | Unlimited |
| ChromaDB | Free (local) | Unlimited |

Claude Haiku is the most cost-efficient model in the Anthropic family — fast, accurate, and generous on free tier for hackathon-scale usage.

---

## Frontend Architecture

```
src/
├── App.jsx              State router: landing ↔ dashboard
├── pages/
│   ├── Landing.jsx      Hero + animated upload zone
│   └── Dashboard.jsx    Metrics + charts + chat
└── index.css            Design system (CSS variables, animations)
```

**Design system colors:**
- Background: `#060B14` (deep navy)
- Cards: `#0F1624`
- Accent: `#6366F1` (indigo)
- Teal: `#14B8A6`
- Text: `#F1F5F9` / `#64748B`
- Fonts: Syne (display) + DM Sans (body)

---

## Troubleshooting

**First upload slow?**
Normal — SentenceTransformers downloads `all-MiniLM-L6-v2` model on first run (~90MB). Cached forever after.

**"anthropic" import error?**
Run `pip install anthropic==0.25.0` inside the activated venv.

**Charts not showing?**
Claude may not extract chart-ready data from text-only files. Works best with CSVs.

**ChromaDB error on Windows?**
Install Visual C++ Build Tools from Microsoft, then reinstall: `pip install chromadb`
