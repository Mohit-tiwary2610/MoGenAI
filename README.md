# MoGenAI — AI Business Intelligence Engine
 
> **FlowZint AI Hackathon 2026 · Open Innovation · Solo submission by Mohit Tiwary**
 
![Hackathon](https://img.shields.io/badge/FlowZint%20Hackathon-2026-7c3aed?style=flat-square)
![Status](https://img.shields.io/badge/Status-In%20Development-f59e0b?style=flat-square)
![Python](https://img.shields.io/badge/Python-3.11-3b82f6?style=flat-square)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-10b981?style=flat-square)
 
Upload any business file. Get executive-grade insights, auto-generated dashboards, and a conversational AI that knows your data — in 90 seconds.
 
---
 
## Demo
 
> 📸 **Screenshots coming soon** — drop a file, get a dashboard in 90 seconds.
 
<!-- Add screenshots here:
![Landing page](docs/landing.png)
![Dashboard](docs/dashboard.png)
![Chat Q&A](docs/chat.png)
-->
 
---
 
## What It Does
 
| Feature | Description |
|---|---|
| Multi-format ingestion | CSV, PDF, DOCX, JSON, TXT — drag and drop any file |
| AI summary | Headline, key metrics, top insight, and risk flag generated automatically |
| Auto charts | Bar, line, and pie charts extracted directly from your data |
| Conversational Q&A | Ask questions in plain English, get cited answers backed by source chunks |
| RAG pipeline | ChromaDB vector search + LLM for fast, grounded responses |
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Recharts + Lucide |
| Backend | FastAPI + Uvicorn (Python 3.11) |
| AI | Google Gemini → Groq → Cerebras (triple fallback, all free-tier) |
| Embeddings | SentenceTransformers `all-MiniLM-L6-v2` (runs locally, free) |
| Vector DB | ChromaDB (local, persistent, free) |
| Parsing | pandas, PyMuPDF, python-docx |
 
**All APIs used are free or have sufficient free-tier credits for hackathon use.**
 
---
 
## Quick Start
 
### Prerequisites
- Python 3.11+
- Node.js 18+
- Free API keys: [Google Gemini](https://aistudio.google.com/app/apikey) · [Groq](https://console.groq.com) · [Cerebras](https://cloud.cerebras.ai)
### 1. Clone the repo
 
```bash
git clone https://github.com/Mohit-tiwary2610/MoGenAI.git
cd MoGenAI
```
 
### 2. Set up the backend
 
```bash
cd backend
 
# Create virtual environment
python -m venv venv
 
# Activate (Mac/Linux)
source venv/bin/activate
# Activate (Windows)
venv\Scripts\activate
 
# Install dependencies
pip install -r requirements.txt
 
# Configure environment
cp .env.example .env
# Edit .env and paste your API keys
```
 
**.env file:**
```
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
CEREBRAS_API_KEY=your_cerebras_key_here
CHROMA_PATH=./chroma_db
```
 
**Getting free API keys:**
- **Gemini:** https://aistudio.google.com/app/apikey
- **Groq:** https://console.groq.com → API Keys
- **Cerebras:** https://cloud.cerebras.ai → API Keys
> The app uses Gemini by default and falls back to Groq → Cerebras automatically if rate limits are hit.
 
### 3. Start the backend
 
```bash
# From the backend/ directory (with venv active)
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
 
You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```
 
### 4. Set up the frontend
 
```bash
# In a new terminal
cd frontend
npm install
npm run dev
```
 
You should see:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:3000/
```
 
### 5. Open the app
 
Navigate to **http://localhost:3000** in your browser.
 
---
 
## Using MoGenAI
 
1. **Upload a file** — drag and drop any CSV, PDF, DOCX, JSON, or TXT file onto the landing page
2. **Wait ~90 seconds** — AI processes, indexes, and generates your dashboard
3. **Explore the dashboard** — view auto-generated metrics, charts, and the AI summary
4. **Ask questions** — type any business question in the chat panel
5. **Read cited answers** — every answer shows which data chunks were used
### Example questions to try
- "What is the total revenue?"
- "Which category performed best?"
- "Show me the trend over time"
- "What are the top 3 risks in this data?"
- "Which month had the lowest sales?"
---
 
## Project Structure
 
```
mogenai/
├── backend/
│   ├── main.py              # FastAPI app + all API routes
│   ├── parser_module.py     # CSV / PDF / DOCX / JSON parser
│   ├── chunker.py           # Text → semantic chunks
│   ├── embedder.py          # SentenceTransformers + ChromaDB
│   ├── insight_engine.py    # LLM integration (Gemini / Groq / Cerebras)
│   ├── store.py             # JSON-based metadata store
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment template
│   └── start.sh             # One-click backend start
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx  # Upload + hero page
│   │   │   ├── Landing.css
│   │   │   ├── Dashboard.jsx # Analytics + chat view
│   │   │   └── Dashboard.css
│   │   ├── App.jsx          # Root component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global design system
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```
 
---
 
## API Reference
 
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload file, trigger AI analysis |
| GET | `/api/summary/{file_id}` | Get summary + charts for a file |
| GET | `/api/files` | List all uploaded files |
| POST | `/api/ask` | Ask a question about a file |
 
---
 
## Troubleshooting
 
**Backend won't start:**
- Ensure Python 3.11+ is installed: `python --version`
- Ensure venv is activated before running uvicorn
- Check `.env` has valid API keys for at least one provider
**"Module not found" errors:**
- Run `pip install -r requirements.txt` again inside the venv
**Slow first upload:**
- First run downloads the SentenceTransformer model (~90MB). Subsequent runs are instant.
**Frontend shows "Upload failed":**
- Confirm backend is running on port 8000
- Check browser console for CORS errors
- Vite proxies `/api` to `http://localhost:8000` automatically
**PDF not parsing:**
- Ensure PyMuPDF installed: `pip install PyMuPDF`
**AI responses failing:**
- Check that at least one API key in `.env` is valid
- The app will automatically try all three providers before failing
---
 
## Hackathon Context
 
- **Event:** FlowZint AI Hackathon 2026
- **Domain:** Open Innovation
- **Developer:** Mohit Tiwary (solo)
- **Timeline:** 4-week build (May 15 – June 15, 2026)
- **Submission deadline:** July 4, 2026
---
 
## Author
 
**Mohit Tiwary**
- GitHub: [@Mohit-tiwary2610](https://github.com/Mohit-tiwary2610)
- LinkedIn: [tiwary-mohit](https://linkedin.com/in/tiwary-mohit)
- Email: mtiwary982@gmail.com
---
 
*Built entirely on free-tier infrastructure — Gemini, Groq, Cerebras, SentenceTransformers, and ChromaDB. Zero paid services required.*