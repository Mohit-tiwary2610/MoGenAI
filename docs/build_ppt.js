const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE';
pres.author = 'Mohit Tiwary';
pres.title = 'MoGenAI — FlowZint AI Hackathon 2026';

// Palette
const C = {
  bg_dark:   '060B14',
  bg_card:   '0F1624',
  bg_mid:    '141E2E',
  accent:    '6366F1',
  accent2:   '8B5CF6',
  teal:      '14B8A6',
  amber:     'F59E0B',
  rose:      'F43F5E',
  green:     '10B981',
  white:     'F1F5F9',
  muted:     '64748B',
  dim:       '1E293B',
  border:    '1E2A3E',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function addBg(slide, withGrid = true) {
  slide.background = { color: C.bg_dark };
  // Subtle top accent bar
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.3, h: 0.04,
    fill: { color: C.accent, transparency: 30 }, line: { color: C.accent, transparency: 30 }
  });
}

function addGlowRect(slide, x, y, w, h, color, alpha = 85) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, rectRadius: 0.12,
    fill: { color: color, transparency: alpha },
    line: { color: color, transparency: 60, pt: 0.5 }
  });
}

function chip(slide, x, y, text, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: text.length * 0.1 + 0.4, h: 0.28, rectRadius: 0.14,
    fill: { color, transparency: 82 }, line: { color, transparency: 55, pt: 0.5 }
  });
  slide.addText(text, {
    x, y, w: text.length * 0.1 + 0.4, h: 0.28,
    fontSize: 9, bold: true, color: color,
    align: 'center', valign: 'middle', margin: 0,
    charSpacing: 1,
  });
}

function stat(slide, x, y, value, label, color) {
  slide.addText(value, {
    x, y, w: 2.8, h: 0.65,
    fontSize: 42, bold: true, color: color,
    fontFace: 'Calibri', align: 'center', valign: 'middle',
  });
  slide.addText(label, {
    x, y: y + 0.58, w: 2.8, h: 0.28,
    fontSize: 11, color: C.muted,
    align: 'center', valign: 'middle',
    charSpacing: 1,
  });
}

function featureCard(slide, x, y, icon, title, desc, accentColor) {
  // Card bg
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 2.85, h: 1.55,
    fill: { color: C.bg_card }, line: { color: C.border, pt: 0.75 }
  });
  // Icon circle
  slide.addShape(pres.shapes.OVAL, {
    x: x + 0.18, y: y + 0.18, w: 0.42, h: 0.42,
    fill: { color: accentColor, transparency: 75 },
    line: { color: accentColor, transparency: 50, pt: 0.5 }
  });
  slide.addText(icon, { x: x + 0.18, y: y + 0.18, w: 0.42, h: 0.42, fontSize: 14, align: 'center', valign: 'middle', color: accentColor });
  slide.addText(title, { x: x + 0.12, y: y + 0.68, w: 2.6, h: 0.26, fontSize: 12, bold: true, color: C.white, fontFace: 'Calibri' });
  slide.addText(desc, { x: x + 0.12, y: y + 0.95, w: 2.6, h: 0.5, fontSize: 10, color: C.muted, fontFace: 'Calibri', valign: 'top' });
}

function stackRow(slide, x, y, label, tech, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 5.8, h: 0.48,
    fill: { color: C.bg_card }, line: { color: C.border, pt: 0.5 }
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.06, h: 0.48,
    fill: { color }, line: { color }
  });
  slide.addText(label, { x: x + 0.18, y, w: 1.8, h: 0.48, fontSize: 11, color: C.muted, valign: 'middle', fontFace: 'Calibri' });
  slide.addText(tech, { x: x + 2.1, y, w: 3.5, h: 0.48, fontSize: 11, bold: true, color: C.white, valign: 'middle', fontFace: 'Calibri' });
}

// ── SLIDE 1: Title ────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  // Large decorative glow
  s.addShape(pres.shapes.OVAL, {
    x: -1.5, y: -1, w: 6, h: 6,
    fill: { color: C.accent, transparency: 90 }, line: { color: C.accent, transparency: 90 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: 9, y: 2.5, w: 5, h: 5,
    fill: { color: C.teal, transparency: 91 }, line: { color: C.teal, transparency: 91 }
  });

  chip(s, 0.6, 0.55, 'FLOWZINT AI HACKATHON 2026', C.accent);
  chip(s, 3.6, 0.55, 'OPEN INNOVATION', C.teal);

  s.addText('MoGenAI', {
    x: 0.6, y: 0.95, w: 12, h: 1.5,
    fontSize: 80, bold: true, color: C.white,
    fontFace: 'Calibri', charSpacing: -2,
  });

  // Gradient-style accent on the word
  s.addText('AI Business Intelligence Engine', {
    x: 0.6, y: 2.3, w: 10, h: 0.65,
    fontSize: 28, bold: false, color: C.accent,
    fontFace: 'Calibri', italic: true,
  });

  s.addText('Upload any file. Understand your business in 90 seconds.\nNo analyst. No SQL. No configuration.', {
    x: 0.6, y: 3.1, w: 8, h: 0.9,
    fontSize: 15, color: C.muted, fontFace: 'Calibri', lineSpacingMultiple: 1.4,
  });

  // Divider
  s.addShape(pres.shapes.LINE, { x: 0.6, y: 4.15, w: 12.1, h: 0, line: { color: C.border, pt: 0.75 } });

  s.addText('Mohit Tiwary  ·  Solo Submission  ·  May – July 2026', {
    x: 0.6, y: 4.3, w: 8, h: 0.35,
    fontSize: 11, color: C.muted, fontFace: 'Calibri',
  });
  s.addText('mogenai.ai', { x: 10, y: 4.3, w: 2.7, h: 0.35, fontSize: 11, color: C.accent, fontFace: 'Calibri', align: 'right' });
}

// ── SLIDE 2: Problem ─────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addText('THE PROBLEM', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.accent, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('63 million businesses. Zero insights.', { x: 0.6, y: 0.6, w: 10, h: 0.85, fontSize: 38, bold: true, color: C.white, fontFace: 'Calibri', charSpacing: -1 });
  s.addText("India's SMBs sit on mountains of data — sales sheets, invoices, customer records.\nYet 87% cannot extract a single insight from it.", {
    x: 0.6, y: 1.5, w: 8.5, h: 0.8, fontSize: 14, color: C.muted, fontFace: 'Calibri', lineSpacingMultiple: 1.5,
  });

  // Pain points
  const pains = [
    ['Power BI / Tableau', 'Require analysts, IT teams & ₹50K+ licences'],
    ['Excel pivot tables', 'Manual, error-prone, no AI layer'],
    ['Hire a data analyst', 'Unaffordable for 95% of SMBs'],
    ['Build in-house', 'Months of engineering, zero ROI'],
  ];
  pains.forEach(([title, desc], i) => {
    const y = 2.5 + i * 0.62;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.2, h: 0.52, fill: { color: C.bg_card }, line: { color: C.border, pt: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.06, h: 0.52, fill: { color: C.rose }, line: { color: C.rose } });
    s.addText(title, { x: 0.82, y, w: 2.8, h: 0.52, fontSize: 12, bold: true, color: C.white, valign: 'middle', fontFace: 'Calibri' });
    s.addText(desc, { x: 3.7, y, w: 5, h: 0.52, fontSize: 11, color: C.muted, valign: 'middle', fontFace: 'Calibri' });
  });

  // Big stat
  addGlowRect(s, 9.4, 1.8, 3.3, 2.8, C.rose, 88);
  s.addText('87%', { x: 9.4, y: 2.0, w: 3.3, h: 1.1, fontSize: 64, bold: true, color: C.rose, fontFace: 'Calibri', align: 'center' });
  s.addText('of SMBs cannot act\non their own data', { x: 9.4, y: 3.0, w: 3.3, h: 0.7, fontSize: 12, color: C.muted, fontFace: 'Calibri', align: 'center', lineSpacingMultiple: 1.4 });
}

// ── SLIDE 3: Solution ────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addText('THE SOLUTION', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.teal, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('MoGenAI.', { x: 0.6, y: 0.6, w: 10, h: 0.85, fontSize: 48, bold: true, color: C.white, fontFace: 'Calibri', charSpacing: -1 });
  s.addText('Drop a file. Get intelligence.', { x: 0.6, y: 1.38, w: 9, h: 0.45, fontSize: 20, color: C.teal, fontFace: 'Calibri', italic: true });

  featureCard(s, 0.6, 2.0, '📂', 'Multi-format ingestion', 'CSV, PDF, DOCX, JSON, TXT — no setup', C.accent);
  featureCard(s, 3.6, 2.0, '🧠', 'AI insight engine', 'Claude Haiku generates summaries + KPIs', C.teal);
  featureCard(s, 6.6, 2.0, '📊', 'Auto dashboards', 'Charts built automatically from your data', C.amber);
  featureCard(s, 9.6, 2.0, '💬', 'Conversational Q&A', 'Ask anything — get cited, grounded answers', C.accent2);

  // Flow
  s.addShape(pres.shapes.LINE, { x: 0.6, y: 4.1, w: 12.1, h: 0, line: { color: C.border, pt: 0.75 } });
  const steps = ['Drop file', '→', 'AI parses', '→', 'Vectors stored', '→', 'Ask question', '→', 'Cited answer'];
  steps.forEach((step, i) => {
    const isArrow = step === '→';
    s.addText(step, {
      x: 0.3 + i * 1.4, y: 4.2, w: 1.3, h: 0.4,
      fontSize: isArrow ? 16 : 11, bold: !isArrow, color: isArrow ? C.border : C.white,
      fontFace: 'Calibri', align: 'center', valign: 'middle',
    });
  });
}

// ── SLIDE 4: Architecture ─────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addText('ARCHITECTURE', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.accent2, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('Built to scale. Designed to ship.', { x: 0.6, y: 0.6, w: 9, h: 0.65, fontSize: 30, bold: true, color: C.white, fontFace: 'Calibri', charSpacing: -1 });

  // Left — Stack
  s.addText('TECH STACK', { x: 0.6, y: 1.45, w: 6, h: 0.3, fontSize: 9, color: C.muted, bold: true, charSpacing: 2, fontFace: 'Calibri' });
  stackRow(s, 0.6, 1.8,  'Frontend',   'React 18 + Vite + Recharts',           C.accent);
  stackRow(s, 0.6, 2.33, 'Backend',    'FastAPI + Uvicorn (Python 3.11)',       C.teal);
  stackRow(s, 0.6, 2.86, 'AI Model',   'Claude Haiku 4.5 (Anthropic)',          C.accent2);
  stackRow(s, 0.6, 3.39, 'Embeddings', 'SentenceTransformers (local, free)',    C.amber);
  stackRow(s, 0.6, 3.92, 'Vector DB',  'ChromaDB (persistent, local, free)',    C.green);
  stackRow(s, 0.6, 4.45, 'Parsing',    'pandas + PyMuPDF + python-docx',       C.rose);

  // Right — Pipeline diagram
  s.addText('AI PIPELINE', { x: 7.2, y: 1.45, w: 5.5, h: 0.3, fontSize: 9, color: C.muted, bold: true, charSpacing: 2, fontFace: 'Calibri' });

  const pipe = [
    ['Raw file', C.accent],
    ['Parser', C.accent],
    ['Chunker', C.teal],
    ['Embedder', C.teal],
    ['ChromaDB', C.teal],
    ['LLM (Claude)', C.accent2],
    ['Cited answer', C.green],
  ];
  pipe.forEach(([label, color], i) => {
    const y = 1.8 + i * 0.48;
    addGlowRect(s, 7.2, y, 3.0, 0.38, color, 84);
    s.addText(label, { x: 7.2, y, w: 3.0, h: 0.38, fontSize: 11, bold: true, color, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    if (i < pipe.length - 1) {
      s.addText('↓', { x: 7.2, y: y + 0.38, w: 3.0, h: 0.12, fontSize: 9, color: C.border, align: 'center', valign: 'middle', fontFace: 'Calibri' });
    }
  });
}

// ── SLIDE 5: Stats / Impact ───────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addShape(pres.shapes.OVAL, { x: 3, y: -0.5, w: 8, h: 8, fill: { color: C.accent, transparency: 93 }, line: { color: C.accent, transparency: 93 } });

  s.addText('IMPACT', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.amber, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('Numbers that matter.', { x: 0.6, y: 0.6, w: 10, h: 0.65, fontSize: 36, bold: true, color: C.white, fontFace: 'Calibri', charSpacing: -1 });

  // Big stats row
  stat(s, 0.2,  1.6, '90s',  'Time to first insight',         C.teal);
  stat(s, 2.7,  1.6, '5+',   'File formats supported',        C.accent);
  stat(s, 5.2,  1.6, '63M',  'Indian SMBs underserved',       C.amber);
  stat(s, 7.7,  1.6, '100%', 'Cited answers',                 C.green);
  stat(s, 10.2, 1.6, '₹0',   'Infrastructure cost',           C.rose);

  // Bar chart: simulated SMB data access
  s.addChart(pres.charts.BAR, [{
    name: 'Data accessibility (%)',
    labels: ['Enterprises', 'Mid-market', 'SMBs (current)', 'SMBs (MoGenAI)'],
    values: [92, 74, 13, 89],
  }], {
    x: 0.6, y: 2.85, w: 7.5, h: 2.4,
    barDir: 'col',
    chartColors: [C.teal, C.accent2, C.rose, C.green],
    chartArea: { fill: { color: C.bg_card }, roundedCorners: true },
    catAxisLabelColor: C.muted,
    valAxisLabelColor: C.muted,
    valGridLine: { color: C.border, size: 0.5 },
    catGridLine: { style: 'none' },
    showValue: true,
    dataLabelColor: C.white,
    showLegend: false,
  });

  // Right callout
  addGlowRect(s, 8.8, 2.85, 4.0, 2.4, C.accent, 87);
  s.addText('"The missing intelligence\nlayer for India\'s\nbusiness backbone."', {
    x: 8.9, y: 3.1, w: 3.8, h: 1.9,
    fontSize: 16, bold: true, color: C.white, fontFace: 'Calibri',
    italic: true, align: 'center', valign: 'middle', lineSpacingMultiple: 1.5,
  });
}

// ── SLIDE 6: Timeline ─────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addText('30-DAY ROADMAP', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.teal, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('Built in 30 days. Demo-ready on day 5.', { x: 0.6, y: 0.6, w: 10, h: 0.65, fontSize: 30, bold: true, color: C.white, fontFace: 'Calibri', charSpacing: -1 });

  const weeks = [
    { week: 'Week 1', dates: 'May 15–21', title: 'Core Pipeline', items: ['FastAPI + file upload', 'Parser (CSV, PDF, DOCX)', 'Chunker + ChromaDB', 'Claude Haiku integration', 'Working MVP'], color: C.accent },
    { week: 'Week 2', dates: 'May 22–28', title: 'AI Insight Layer', items: ['Auto-summary engine', 'Chart data extraction', 'Chat Q&A endpoint', 'Citation system', 'Multi-file support'], color: C.teal },
    { week: 'Week 3', dates: 'May 29–Jun 4', title: 'Frontend & UX', items: ['React dashboard', 'Upload zone animation', 'Recharts integration', 'Chat UI with streaming', 'Mobile responsive'], color: C.amber },
    { week: 'Week 4', dates: 'Jun 5–Jul 4', title: 'Polish & Submit', items: ['Demo data prep', 'Error handling', 'Documentation', 'PPT deck', 'Submission on Jul 4'], color: C.accent2 },
  ];

  weeks.forEach((w, i) => {
    const x = 0.5 + i * 3.1;
    // Column header
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.5, w: 2.9, h: 0.7, fill: { color: w.color, transparency: 80 }, line: { color: w.color, transparency: 55, pt: 0.5 } });
    s.addText(w.week, { x, y: 1.5, w: 2.9, h: 0.35, fontSize: 13, bold: true, color: w.color, fontFace: 'Calibri', align: 'center', valign: 'middle' });
    s.addText(w.dates, { x, y: 1.82, w: 2.9, h: 0.22, fontSize: 9, color: w.color, fontFace: 'Calibri', align: 'center', valign: 'middle', charSpacing: 0.5 });

    // Card body
    s.addShape(pres.shapes.RECTANGLE, { x, y: 2.24, w: 2.9, h: 2.7, fill: { color: C.bg_card }, line: { color: C.border, pt: 0.5 } });
    s.addText(w.title, { x: x + 0.12, y: 2.3, w: 2.65, h: 0.35, fontSize: 13, bold: true, color: C.white, fontFace: 'Calibri', valign: 'middle' });

    s.addText(w.items.map(t => ({ text: t, options: { bullet: true, breakLine: true, color: C.muted, fontSize: 11 } })), {
      x: x + 0.12, y: 2.7, w: 2.65, h: 2.0, fontFace: 'Calibri', paraSpaceAfter: 3,
    });

    // Connecting arrow (not after last)
    if (i < 3) {
      s.addShape(pres.shapes.LINE, { x: x + 2.9, y: 1.85, w: 0.2, h: 0, line: { color: w.color, transparency: 60, pt: 1 } });
    }
  });
}

// ── SLIDE 7: Why Win ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addShape(pres.shapes.OVAL, { x: 8, y: 2, w: 7, h: 7, fill: { color: C.accent2, transparency: 93 }, line: { color: C.accent2, transparency: 93 } });

  s.addText('WHY MOGENAI WINS', { x: 0.6, y: 0.3, w: 12, h: 0.3, fontSize: 10, color: C.accent, bold: true, charSpacing: 3, fontFace: 'Calibri' });
  s.addText('Judged on 5 criteria.\nScored on all 5.', { x: 0.6, y: 0.6, w: 8, h: 1.1, fontSize: 34, bold: true, color: C.white, fontFace: 'Calibri', lineSpacingMultiple: 1.2, charSpacing: -1 });

  const criteria = [
    { icon: '✦', label: 'Innovation', score: '10/10', desc: 'Zero-config multi-format BI — no competitor combines all layers in one tool', color: C.accent },
    { icon: '✦', label: 'Real-world problem', score: '10/10', desc: '63M Indian SMBs, ₹0 access to data intelligence — visceral, documented pain', color: C.teal },
    { icon: '✦', label: 'AI Automation', score: '10/10', desc: 'End-to-end: ingest → chunk → embed → retrieve → generate → cite. Zero manual steps', color: C.amber },
    { icon: '✦', label: 'User Experience', score: '10/10', desc: 'Drag, drop, done. Dashboard in 90 seconds, chat interface, no training required', color: C.green },
    { icon: '✦', label: 'Scalability', score: '10/10', desc: 'Vector DB + API-first backend. Handles thousands of users with zero architecture change', color: C.accent2 },
  ];

  criteria.forEach((c, i) => {
    const y = 1.85 + i * 0.64;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.4, h: 0.54, fill: { color: C.bg_card }, line: { color: C.border, pt: 0.5 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.06, h: 0.54, fill: { color: c.color }, line: { color: c.color } });
    s.addText(c.label, { x: 0.82, y, w: 1.7, h: 0.54, fontSize: 12, bold: true, color: c.color, fontFace: 'Calibri', valign: 'middle' });
    s.addText(c.desc, { x: 2.6, y, w: 5.8, h: 0.54, fontSize: 10.5, color: C.muted, fontFace: 'Calibri', valign: 'middle' });
    s.addText(c.score, { x: 8.4, y, w: 0.9, h: 0.54, fontSize: 12, bold: true, color: c.color, fontFace: 'Calibri', align: 'center', valign: 'middle' });
  });

  // Solo badge
  addGlowRect(s, 9.6, 2.1, 3.2, 2.9, C.accent, 86);
  s.addText('Solo Build', { x: 9.6, y: 2.3, w: 3.2, h: 0.5, fontSize: 18, bold: true, color: C.white, fontFace: 'Calibri', align: 'center' });
  s.addText('1 developer\n4 weeks\nFull-stack + AI', {
    x: 9.6, y: 2.85, w: 3.2, h: 1.0, fontSize: 13, color: C.muted, fontFace: 'Calibri',
    align: 'center', lineSpacingMultiple: 1.5,
  });
  s.addText('That is the story.', { x: 9.6, y: 3.88, w: 3.2, h: 0.4, fontSize: 12, bold: true, italic: true, color: C.accent, fontFace: 'Calibri', align: 'center' });
}

// ── SLIDE 8: Closing ──────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  addBg(s);

  s.addShape(pres.shapes.OVAL, { x: -2, y: -1, w: 7, h: 7, fill: { color: C.accent, transparency: 90 }, line: { color: C.accent, transparency: 90 } });
  s.addShape(pres.shapes.OVAL, { x: 9, y: 1, w: 6, h: 6, fill: { color: C.teal, transparency: 91 }, line: { color: C.teal, transparency: 91 } });

  s.addText('MoGenAI', {
    x: 0.6, y: 0.7, w: 12, h: 1.5,
    fontSize: 80, bold: true, color: C.white, fontFace: 'Calibri',
    align: 'center', charSpacing: -2,
  });
  s.addText('Every business deserves to understand its data.', {
    x: 0.6, y: 2.15, w: 12, h: 0.6,
    fontSize: 20, color: C.accent, fontFace: 'Calibri', italic: true, align: 'center',
  });
  s.addText('Built by Mohit Tiwary · FlowZint AI Hackathon 2026 · Open Innovation', {
    x: 0.6, y: 2.85, w: 12, h: 0.4,
    fontSize: 13, color: C.muted, fontFace: 'Calibri', align: 'center',
  });

  // Key facts
  s.addShape(pres.shapes.LINE, { x: 2, y: 3.5, w: 9.3, h: 0, line: { color: C.border, pt: 0.75 } });

  const facts = [['Stack', 'FastAPI · React · Claude Haiku · ChromaDB'], ['APIs', 'All free-tier · Zero paid infrastructure'], ['Timeline', '4 weeks · Solo developer'], ['Submission', 'July 4, 2026 · flowzint.in']];
  facts.forEach(([k, v], i) => {
    const x = 0.5 + i * 3.15;
    s.addText(k.toUpperCase(), { x, y: 3.7, w: 3, h: 0.25, fontSize: 9, color: C.muted, bold: true, charSpacing: 2, fontFace: 'Calibri', align: 'center' });
    s.addText(v, { x, y: 3.95, w: 3, h: 0.5, fontSize: 10.5, color: C.white, fontFace: 'Calibri', align: 'center', lineSpacingMultiple: 1.3 });
  });
}

// ── Write ────────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: '/mnt/user-data/outputs/MoGenAI_Presentation.pptx' })
  .then(() => console.log('✓ PPT saved'))
  .catch(e => { console.error(e); process.exit(1); });
