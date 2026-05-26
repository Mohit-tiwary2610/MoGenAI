import { useState, useRef } from 'react'
import { Upload, Zap, Brain, BarChart3, MessageSquare, Shield, ArrowRight, FileText, Database, Sparkles, Sun, Moon } from 'lucide-react'
import axios from 'axios'
import './Landing.css'
 
const FEATURES = [
  { icon: Brain, title: 'AI Insight Engine', desc: 'LLM-powered analysis turns raw data into executive-ready intelligence in seconds.' },
  { icon: BarChart3, title: 'Auto Dashboards', desc: 'Charts and KPIs generated automatically — no configuration, no SQL, no waiting.' },
  { icon: MessageSquare, title: 'Conversational Q&A', desc: 'Ask any question in plain English. Get cited, traceable answers from your data.' },
  { icon: Shield, title: 'Multi-Format Support', desc: 'CSV, PDF, DOCX, JSON, TXT. One interface for all your business data formats.' },
]
 
const FORMATS = ['CSV', 'PDF', 'DOCX', 'JSON', 'TXT']
 
export default function Landing({ onFileUploaded, theme, onThemeToggle }) {
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)
  const fileRef = useRef()
 
  const handleFile = async (file) => {
    if (!file) return
    setError(''); setUploading(true); setProgress(10)
    const fd = new FormData()
    fd.append('file', file)
    try {
      setProgress(30)
      const res = await axios.post('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: e => setProgress(30 + Math.round((e.loaded / e.total) * 40)),
      })
      setProgress(90)
      setTimeout(() => { setProgress(100); setTimeout(() => onFileUploaded(res.data), 400) }, 600)
    } catch (e) {
      setError(e.response?.data?.detail || 'Upload failed. Check your backend is running.')
      setUploading(false); setProgress(0)
    }
  }
 
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }
 
  return (
    <div className="landing">
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <div className="grid-bg" />
 
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon"><Zap size={16} /></div>
          <span className="nav-logo-text">MoGenAI</span>
        </div>
        <div className="nav-right">
          <button className="theme-toggle" onClick={onThemeToggle} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
 
      <section className="hero">
        <div className="hero-eyebrow animate-fade-up">
          <Sparkles size={14} />
          <span>AI Business Intelligence — Zero Setup</span>
        </div>
        <h1 className="hero-title animate-fade-up" style={{animationDelay:'0.1s'}}>
          Your data deserves<br />
          <span className="hero-gradient">a real analyst.</span>
        </h1>
        <p className="hero-sub animate-fade-up" style={{animationDelay:'0.2s'}}>
          Drop any business file. Get executive insights, auto-generated dashboards,<br />
          and a conversational AI that knows your data — in 90 seconds.
        </p>
 
        <div className="upload-wrap animate-fade-up" style={{animationDelay:'0.3s'}}>
          <div
            className={`upload-zone ${dragging?'dragging':''} ${uploading?'uploading':''}`}
            onDragOver={e=>{e.preventDefault();setDragging(true)}}
            onDragLeave={()=>setDragging(false)}
            onDrop={onDrop}
            onClick={()=>!uploading&&fileRef.current.click()}
          >
            {uploading ? (
              <div className="upload-progress-state">
                <div className="upload-spinner" />
                <p className="upload-status-text">Analysing your data with AI...</p>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{width:`${progress}%`}} />
                </div>
                <p className="progress-pct">{progress}%</p>
              </div>
            ) : (
              <>
                <div className={`upload-icon-wrap ${dragging?'pulse':''}`}><Upload size={28} /></div>
                <p className="upload-main">Drop your file here</p>
                <p className="upload-sub">or click to browse — up to 10 MB</p>
                <div className="format-pills">
                  {FORMATS.map(f => <span key={f} className="format-pill">{f}</span>)}
                </div>
              </>
            )}
          </div>
          {error && <div className="upload-error">{error}</div>}
        </div>
 
        <div className="hero-stats animate-fade-up" style={{animationDelay:'0.4s'}}>
          <div className="stat"><strong>90s</strong><span>time to insight</span></div>
          <div className="stat-divider" />
          <div className="stat"><strong>5+</strong><span>file formats</span></div>
          <div className="stat-divider" />
          <div className="stat"><strong>100%</strong><span>cited answers</span></div>
          <div className="stat-divider" />
          <div className="stat"><strong>Free</strong><span>API tier ready</span></div>
        </div>
      </section>
 
      <section className="features">
        <div className="features-grid">
          {FEATURES.map((f,i) => (
            <div key={i} className="feature-card animate-fade-up" style={{animationDelay:`${0.1*i}s`}}>
              <div className="feature-icon"><f.icon size={20} /></div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
 
      <section className="how-it-works">
        {[
          {num:'01', icon:FileText, label:'Drop any file'},
          null,
          {num:'02', icon:Brain, label:'AI analyses instantly'},
          null,
          {num:'03', icon:Database, label:'Explore your insights'},
          null,
          {num:'04', icon:MessageSquare, label:'Ask any question'},
        ].map((step, i) =>
          step === null
            ? <div key={i} className="step-arrow"><ArrowRight size={18} /></div>
            : <div key={i} className="how-step">
                <div className="step-num">{step.num}</div>
                <step.icon size={20} className="step-icon" />
                <p>{step.label}</p>
              </div>
        )}
      </section>
 
      <input ref={fileRef} type="file" accept=".csv,.pdf,.docx,.json,.txt"
        style={{display:'none'}} onChange={e=>handleFile(e.target.files[0])} />
 
      <footer className="landing-footer">
        <span>MoGenAI © 2026 · Built by Mohit Tiwary</span>
      </footer>
    </div>
  )
}