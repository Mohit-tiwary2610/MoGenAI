import io, csv
from typing import Tuple

def parse_file(filename: str, content: bytes) -> Tuple[str, int]:
    ext = filename.lower().split(".")[-1]
    if ext == "csv":
        return parse_csv(content)
    elif ext in ("txt", "md"):
        text = content.decode("utf-8", errors="ignore")
        rows = len(text.splitlines())
        return text, rows
    elif ext == "json":
        return parse_json(content)
    elif ext == "pdf":
        return parse_pdf(content)
    elif ext in ("docx",):
        return parse_docx(content)
    else:
        text = content.decode("utf-8", errors="ignore")
        return text, len(text.splitlines())

def parse_csv(content: bytes) -> Tuple[str, int]:
    try:
        text = content.decode("utf-8", errors="ignore")
        reader = csv.reader(io.StringIO(text))
        rows = list(reader)
        if not rows:
            return "", 0
        header = rows[0]
        lines = [",".join(header)]
        for row in rows[1:]:
            lines.append(",".join(row))
        return "\n".join(lines), len(rows) - 1
    except Exception:
        return content.decode("utf-8", errors="ignore"), 0

def parse_json(content: bytes) -> Tuple[str, int]:
    import json
    try:
        data = json.loads(content)
        if isinstance(data, list):
            lines = [json.dumps(item) for item in data]
            return "\n".join(lines), len(data)
        return json.dumps(data, indent=2), 1
    except Exception:
        return content.decode("utf-8", errors="ignore"), 0

def parse_pdf(content: bytes) -> Tuple[str, int]:
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(stream=content, filetype="pdf")
        pages = []
        for page in doc:
            pages.append(page.get_text())
        text = "\n\n".join(pages)
        return text, len(pages)
    except ImportError:
        return content.decode("utf-8", errors="ignore"), 0

def parse_docx(content: bytes) -> Tuple[str, int]:
    try:
        from docx import Document
        doc = Document(io.BytesIO(content))
        paras = [p.text for p in doc.paragraphs if p.text.strip()]
        return "\n".join(paras), len(paras)
    except ImportError:
        return content.decode("utf-8", errors="ignore"), 0
