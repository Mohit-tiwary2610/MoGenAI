"""
MoGenAI — AI Provider with automatic fallback chain
Priority: Google Gemini → Groq → Cerebras
When one provider hits rate limits or errors, automatically falls to the next.
"""
 
import os, json, re, time, logging
from typing import List, Tuple, Dict, Optional
from dotenv import load_dotenv # type: ignore
 
load_dotenv()
 
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("mogenai.ai")
 
# ── Prompts ────────────────────────────────────────────────────────────────────
 
SYSTEM_PROMPT = """You are MoGenAI, an elite business intelligence AI.
Your job: extract actionable insights from business data.
Rules:
- Answer ONLY from the provided data. Never hallucinate.
- Be concise, direct, and business-focused.
- Always end your answer with: SOURCES: [chunk indices used, comma separated]
- Use ₹ for Indian currency context when relevant."""
 
SUMMARY_PROMPT = """Analyze this business data and return ONLY valid JSON (no markdown, no explanation):
{
  "headline": "one sharp sentence summarizing the dataset",
  "key_metrics": [
    {"label": "metric name", "value": "metric value", "trend": "up|down|neutral"}
  ],
  "top_insight": "single most important business finding",
  "risk": "biggest risk or concern in the data",
  "suggested_questions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}
Return exactly 3-4 key_metrics and exactly 3 suggested_questions. No markdown fences."""
 
CHART_PROMPT = """Analyze this data and return ONLY a valid JSON array of chart configs (no markdown, no explanation):
[
  {
    "type": "bar",
    "title": "chart title",
    "labels": ["label1", "label2"],
    "values": [100, 200],
    "color": "6366f1"
  }
]
Extract 2-3 meaningful charts. Use real numbers from the data. No markdown fences."""
 
# ── Provider state tracker ─────────────────────────────────────────────────────
 
_provider_status = {
    "gemini":   {"available": True, "last_error": None, "calls": 0},
    "groq":     {"available": True, "last_error": None, "calls": 0},
    "cerebras": {"available": True, "last_error": None, "calls": 0},
}
_active_provider = "gemini"
 
 
def get_provider_status() -> Dict:
    """Returns current provider health — exposed via API for dashboard."""
    return {
        name: {
            "available": info["available"],
            "calls": info["calls"],
            "last_error": info["last_error"],
        }
        for name, info in _provider_status.items()
    }
 
 
def _mark_failed(provider: str, error: str):
    global _active_provider
    _provider_status[provider]["available"] = False
    _provider_status[provider]["last_error"] = str(error)[:120]
    logger.warning(f"[MoGenAI] Provider '{provider}' marked unavailable: {error}")
    # Try to recover after 60s on next call
    _provider_status[provider]["cooldown_until"] = time.time() + 60
 
 
def _maybe_recover(provider: str):
    cooldown = _provider_status[provider].get("cooldown_until", 0)
    if not _provider_status[provider]["available"] and time.time() > cooldown:
        _provider_status[provider]["available"] = True
        logger.info(f"[MoGenAI] Provider '{provider}' recovered — retrying.")
 
 
def _increment(provider: str):
    _provider_status[provider]["calls"] += 1
 
# ── Provider implementations ───────────────────────────────────────────────────
 
def _call_gemini(system: str, user: str, max_tokens: int = 800) -> str:
    import google.generativeai as genai # type: ignore
    key = os.getenv("GEMINI_API_KEY", "")
    if not key:
        raise ValueError("GEMINI_API_KEY not set")
    genai.configure(api_key=key)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=system,
        generation_config={"max_output_tokens": max_tokens, "temperature": 0.2},
    )
    resp = model.generate_content(user)
    return resp.text.strip()
 
 
def _call_groq(system: str, user: str, max_tokens: int = 800) -> str:
    from groq import Groq # type: ignore
    key = os.getenv("GROQ_API_KEY", "")
    if not key:
        raise ValueError("GROQ_API_KEY not set")
    client = Groq(api_key=key)
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=max_tokens,
        temperature=0.2,
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
    )
    return resp.choices[0].message.content.strip()
 
 
def _call_cerebras(system: str, user: str, max_tokens: int = 800) -> str:
    from cerebras.cloud.sdk import Cerebras # type: ignore
    key = os.getenv("CEREBRAS_API_KEY", "")
    if not key:
        raise ValueError("CEREBRAS_API_KEY not set")
    client = Cerebras(api_key=key)
    resp = client.chat.completions.create(
        model="llama-3.3-70b",
        max_completion_tokens=max_tokens,
        temperature=0.2,
        messages=[
            {"role": "system", "content": system},
            {"role": "user",   "content": user},
        ],
    )
    return resp.choices[0].message.content.strip()
 
 
# ── Fallback orchestrator ──────────────────────────────────────────────────────
 
PROVIDERS = [
    ("gemini",   _call_gemini),
    ("groq",     _call_groq),
    ("cerebras", _call_cerebras),
]
 
def _call_with_fallback(system: str, user: str, max_tokens: int = 800) -> Tuple[str, str]:
    """
    Try each provider in order. Returns (response_text, provider_name_used).
    Raises RuntimeError if all providers fail.
    """
    global _active_provider
 
    # Try recovery for any cooled-down providers
    for name, _ in PROVIDERS:
        _maybe_recover(name)
 
    errors = []
    for name, fn in PROVIDERS:
        if not _provider_status[name]["available"]:
            errors.append(f"{name}: unavailable (cooling down)")
            continue
        try:
            logger.info(f"[MoGenAI] Calling provider: {name}")
            result = fn(system, user, max_tokens)
            _increment(name)
            _active_provider = name
            return result, name
        except Exception as e:
            err_str = str(e).lower()
            # Rate limit / quota errors → mark unavailable, try next
            if any(x in err_str for x in ["rate", "quota", "limit", "429", "resource_exhausted", "too many"]):
                _mark_failed(name, f"Rate limit: {str(e)[:80]}")
            else:
                # Other errors (auth, network) → also fall through but log differently
                logger.error(f"[MoGenAI] Provider '{name}' error: {e}")
                _mark_failed(name, str(e)[:80])
            errors.append(f"{name}: {str(e)[:60]}")
 
    raise RuntimeError(f"All AI providers failed. Errors: {'; '.join(errors)}")
 
 
def _clean_json(raw: str) -> str:
    raw = re.sub(r"```json\s*", "", raw)
    raw = re.sub(r"```\s*", "", raw)
    # Extract first {...} or [...] block
    m = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", raw)
    return m.group(1).strip() if m else raw.strip()
 
 
# ── Public functions ───────────────────────────────────────────────────────────
 
def generate_summary(text: str, filename: str) -> Dict:
    snippet = text[:4000]
    user = f"Filename: {filename}\n\nData:\n{snippet}"
    try:
        raw, provider = _call_with_fallback(SUMMARY_PROMPT, user, max_tokens=800)
        logger.info(f"[MoGenAI] Summary generated via {provider}")
        return json.loads(_clean_json(raw))
    except Exception as e:
        logger.error(f"[MoGenAI] Summary failed: {e}")
        return {
            "headline": f"Data from {filename} loaded successfully",
            "key_metrics": [{"label": "Records", "value": str(len(text.splitlines())), "trend": "neutral"}],
            "top_insight": "Upload complete. Ask questions to discover insights.",
            "risk": "Insufficient data for automated risk analysis.",
            "suggested_questions": [
                "What are the key trends in this data?",
                "Which category has the highest value?",
                "What is the overall performance summary?",
            ],
        }
 
 
def generate_charts(text: str, filename: str) -> List[Dict]:
    snippet = text[:3000]
    user = f"Filename: {filename}\n\nData:\n{snippet}"
    try:
        raw, provider = _call_with_fallback(CHART_PROMPT, user, max_tokens=600)
        logger.info(f"[MoGenAI] Charts generated via {provider}")
        charts = json.loads(_clean_json(raw))
        return charts if isinstance(charts, list) else []
    except Exception as e:
        logger.error(f"[MoGenAI] Charts failed: {e}")
        return []
 
 
def ask_question(chunks: List[str], question: str) -> Tuple[str, List[str]]:
    if not chunks:
        return "No relevant data found. Please upload a file first.", []
 
    context = "\n---\n".join([f"[Chunk {i+1}]: {c}" for i, c in enumerate(chunks)])
    user = f"Data chunks:\n{context}\n\nQuestion: {question}"
    try:
        raw, provider = _call_with_fallback(SYSTEM_PROMPT, user, max_tokens=600)
        logger.info(f"[MoGenAI] Answer generated via {provider}")
        answer, sources = raw, []
        if "SOURCES:" in answer:
            parts = answer.split("SOURCES:")
            answer = parts[0].strip()
            sources = [s.strip() for s in parts[1].split(",") if s.strip()]
        return answer, sources
    except Exception as e:
        return f"All AI providers are currently rate-limited. Please wait 60 seconds and try again. ({str(e)[:80]})", []