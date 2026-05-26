# 🚀 MoGenAI — Quick Start (Read This First)

## Step 1 — Get your FREE API keys (takes ~6 minutes total)

### 🥇 Google Gemini (PRIMARY — 1,500 req/day free)
1. Go to https://aistudio.google.com
2. Sign in with any Google account (no credit card)
3. Click "Get API Key" → Create API Key → Copy it

### 🥈 Groq (FALLBACK 1 — fastest inference, free)
1. Go to https://console.groq.com
2. Sign up (no credit card needed)
3. API Keys → Create API Key → Copy it

### 🥉 Cerebras (FALLBACK 2 — 60K tokens/min, free)
1. Go to https://cloud.cerebras.ai
2. Sign up (no credit card needed)
3. API Keys → Create → Copy it

> You need at least ONE key. All three = ~3,000+ requests/day combined at zero cost.
> Fallback is automatic — if Gemini hits its limit, Groq takes over silently.

---

## Step 2 — Set up Backend (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt

# NOTE: First install downloads SentenceTransformers model (~90MB). One time only.

# Create your .env file
cp .env.example .env
```

Open `.env` in any text editor and paste your API keys:
```
GEMINI_API_KEY=AIza...your_key_here
GROQ_API_KEY=gsk_...your_key_here
CEREBRAS_API_KEY=csk-...your_key_here
```

Then start the backend:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ You should see: `Uvicorn running on http://0.0.0.0:8000`

---

## Step 3 — Set up Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

✅ You should see: `Local: http://localhost:3000/`

---

## Step 4 — Open the app

👉 Go to **http://localhost:3000** in your browser

---

## Step 5 — Test the demo

👉 Drop `demo_data/sales_data.csv` onto the upload zone
👉 Wait ~15 seconds for AI processing
👉 Ask: **"Which product has the highest revenue?"**
👉 Watch the provider badge in the dashboard — it shows which AI is answering

---

## How the AI fallback works

```
Your question
     │
     ▼
Google Gemini ──→ Rate limit hit? ──→ Groq ──→ Rate limit hit? ──→ Cerebras
     │                                 │                               │
     └─── Answer ◄────────────────────┘◄──────────────────────────────┘
```

The dashboard shows a live provider status bar — green = active, strikethrough = cooling down (auto-recovers after 60 seconds).

---

## Check provider health

Visit: http://localhost:8000/api/status

```json
{
  "active_provider": "gemini",
  "providers": {
    "gemini":   { "available": true,  "calls": 12, "last_error": null },
    "groq":     { "available": true,  "calls": 0,  "last_error": null },
    "cerebras": { "available": true,  "calls": 0,  "last_error": null }
  }
}
```

---

## Troubleshooting

**"Module not found" errors** → Run `pip install -r requirements.txt` inside the venv

**First upload is slow** → Normal — SentenceTransformers downloads model on first run (~90MB)

**All providers failing** → Check your API keys in `.env`. Each key has a different format:
- Gemini: starts with `AIza`
- Groq: starts with `gsk_`
- Cerebras: starts with `csk-`

**Frontend shows "Upload failed"** → Confirm backend is running on port 8000

---

*Built by Mohit Tiwary · FlowZint AI Hackathon 2026 · Open Innovation*
