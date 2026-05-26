import { useState, useEffect } from 'react'
import { ArrowLeft, FileText, TrendingUp, TrendingDown, Minus, BarChart3,
         MessageSquare, Zap, ChevronRight, Send, Loader2, AlertCircle,
         Sparkles, Activity, CheckCircle2, XCircle, Sun, Moon } from 'lucide-react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import axios from 'axios'
import './Dashboard.css'
 
const COLORS = ['#9b7fe8','#0d9488','#e8a838','#e05252','#48bb78','#c084fc','#3b82f6']
 
const PROVIDER_META = {
  gemini:   { label:'Gemini 2.0 Flash', color:'#4285F4', short:'Gemini' },
  groq:     { label:'Groq · Llama 3.3',  color:'#F55036', short:'Groq'   },
  cerebras: { label:'Cerebras · Llama',  color:'#9B59B6', short:'Cerebras'},
  none:     { label:'No provider',       color:'#64748b', short:'None'   },
}
 
const TrendIcon = ({trend}) => {
  if (trend==='up')   return <TrendingUp   size={14} className="trend-up"      />
  if (trend==='down') return <TrendingDown size={14} className="trend-down"    />
  return                     <Minus        size={14} className="trend-neutral" />
}
 
const ProviderBar = ({status}) => {
  if (!status) return null
  const {active_provider, providers} = status
  const meta = PROVIDER_META[active_provider] || PROVIDER_META.none
  return (
    <div className="provider-bar">
      <div className="provider-active">
        <span className="provider-dot" style={{background:meta.color}} />
        <span>AI: <strong>{meta.label}</strong></span>
      </div>
      <div className="provider-chips">
        {Object.entries(providers).map(([name,info]) => {
          const m = PROVIDER_META[name] || PROVIDER_META.none
          const isActive = name === active_provider
          return (
            <span key={name}
              className={`provider-chip ${isActive?'chip-active':''} ${!info.available?'chip-down':''}`}
              title={info.last_error || `${info.calls} calls`}
              style={isActive?{borderColor:m.color,color:m.color}:{}}>
              {info.available ? <CheckCircle2 size={10}/> : <XCircle size={10}/>}
              {m.short}
              {info.calls>0 && <span className="chip-count">{info.calls}</span>}
            </span>
          )
        })}
      </div>
    </div>
  )
}
 
const ChartBlock = ({chart, idx, theme}) => {
  if (!chart || !chart.labels?.length || !chart.values?.length) return null
  const data  = chart.labels.map((l,i) => ({name:l, value:chart.values[i]||0}))
  const color = COLORS[idx % COLORS.length]
  const isDark = theme === 'dark'
 
  const tip = {
    background: isDark ? '#1e1a30' : '#ffffff',
    border: `1px solid ${isDark ? 'rgba(180,160,255,0.3)' : 'rgba(100,65,180,0.2)'}`,
    borderRadius:'10px',
    boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.6)' : '0 8px 32px rgba(100,65,180,0.15)',
    padding:'10px 14px',
  }
  const tickColor   = isDark ? '#a396c8' : '#4a3f78'
  const gridColor   = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,80,180,0.07)'
  const legendColor = isDark ? '#ede9f8' : '#1a1535'
 
  return (
    <div className="chart-card animate-fade-up" style={{animationDelay:`${0.1*idx}s`}}>
      <div className="chart-card-header"><BarChart3 size={15}/><span>{chart.title}</span></div>
      <ResponsiveContainer width="100%" height={200}>
        {chart.type==='pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={72} paddingAngle={3}>
              {data.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} stroke="transparent"/>)}
            </Pie>
            <Tooltip contentStyle={tip}
              labelStyle={{color:legendColor,fontWeight:700,fontSize:'13px'}}
              itemStyle={{color:legendColor,fontSize:'12px'}}
              formatter={(v) => [v.toLocaleString(), '']}
            />
            <Legend
              iconSize={10}
              iconType="circle"
              wrapperStyle={{fontSize:'12px',color:legendColor,paddingTop:'8px',fontFamily:'DM Sans,sans-serif'}}
            />
          </PieChart>
        ) : chart.type==='line' ? (
          <LineChart data={data} margin={{top:5,right:12,bottom:5,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false}/>
            <XAxis dataKey="name" tick={{fill:tickColor,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:tickColor,fontSize:11}} axisLine={false} tickLine={false} width={40}/>
            <Tooltip contentStyle={tip}
              labelStyle={{color:legendColor,fontWeight:700}}
              itemStyle={{color:legendColor}}
            />
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{fill:color,r:4,strokeWidth:0}}/>
          </LineChart>
        ) : (
          <BarChart data={data} margin={{top:5,right:12,bottom:5,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false}/>
            <XAxis dataKey="name" tick={{fill:tickColor,fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:tickColor,fontSize:11}} axisLine={false} tickLine={false} width={40}/>
            <Tooltip contentStyle={tip}
              labelStyle={{color:legendColor,fontWeight:700}}
              itemStyle={{color:legendColor}}
            />
            <Bar dataKey="value" fill={color} radius={[5,5,0,0]} maxBarSize={52}/>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
 
export default function Dashboard({fileMeta, onBack, theme, onThemeToggle}) {
  const [question,   setQuestion]   = useState('')
  const [messages,   setMessages]   = useState([])
  const [loading,    setLoading]    = useState(false)
  const [provStatus, setProvStatus] = useState(null)
 
  const summary   = fileMeta?.summary || {}
  const charts    = fileMeta?.charts  || []
  const metrics   = summary.key_metrics         || []
  const suggested = summary.suggested_questions || []
 
  useEffect(() => {
    const fetch = async () => {
      try { const r = await axios.get('/api/status'); setProvStatus(r.data) } catch(_) {}
    }
    fetch()
    const id = setInterval(fetch, 8000)
    return () => clearInterval(id)
  }, [])
 
  const handleAsk = async (q) => {
    const text = (q || question).trim()
    if (!text || loading) return
    setQuestion('')
    setMessages(prev => [...prev, {role:'user', text}])
    setLoading(true)
    try {
      const res = await axios.post('/api/ask', {file_id:fileMeta.file_id, question:text})
      setMessages(prev => [...prev, {
        role:'ai', text:res.data.answer, sources:res.data.sources||[],
        provider:provStatus?.active_provider
      }])
      const s = await axios.get('/api/status')
      setProvStatus(s.data)
    } catch(e) {
      setMessages(prev => [...prev, {
        role:'ai', text:'Error: '+(e.response?.data?.detail||'Could not get answer.'), error:true
      }])
    }
    setLoading(false)
  }
 
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon"><Zap size={14}/></div>
          <span>MoGenAI</span>
        </div>
 
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={14}/><span>New file</span>
        </button>
 
        <div className="sidebar-file-info">
          <div className="sidebar-file-icon"><FileText size={16}/></div>
          <div>
            <div className="sidebar-file-name">{fileMeta?.filename||'File'}</div>
            <div className="sidebar-file-meta">{fileMeta?.rows>0?`${fileMeta.rows} rows`:''} · {fileMeta?.chunks} chunks</div>
          </div>
        </div>
 
        {summary.top_insight && (
          <div className="sidebar-insight">
            <div className="sidebar-insight-label"><Sparkles size={11}/>Top insight</div>
            <p>{summary.top_insight}</p>
          </div>
        )}
        {summary.risk && (
          <div className="sidebar-risk">
            <div className="sidebar-risk-label"><AlertCircle size={11}/>Risk flag</div>
            <p>{summary.risk}</p>
          </div>
        )}
 
        <div className="sidebar-divider"/>
        <div className="sidebar-section-label">Suggested questions</div>
        {suggested.map((q,i) => (
          <button key={i} className="suggested-q" onClick={()=>handleAsk(q)}>
            <ChevronRight size={12}/><span>{q}</span>
          </button>
        ))}
      </aside>
 
      <main className="main-content">
        <ProviderBar status={provStatus}/>
 
        <div className="dash-header">
          <div className="dash-header-row">
            <div>
              <h1 className="dash-title">{summary.headline||'Intelligence Dashboard'}</h1>
              <p className="dash-sub">Powered by MoGenAI · {fileMeta?.filename}</p>
            </div>
            <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
              {theme==='dark' ? <Sun size={16}/> : <Moon size={16}/>}
            </button>
          </div>
        </div>
 
        {metrics.length>0 && (
          <div className="metrics-grid">
            {metrics.map((m,i) => (
              <div key={i} className="metric-card animate-fade-up" style={{animationDelay:`${0.05*i}s`}}>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value">{m.value}</div>
                <div className={`metric-trend trend-${m.trend}`}><TrendIcon trend={m.trend}/><span>{m.trend}</span></div>
              </div>
            ))}
          </div>
        )}
 
        {charts.length>0 && (
          <div className="charts-grid">
            {charts.map((c,i) => <ChartBlock key={i} chart={c} idx={i} theme={theme}/>)}
          </div>
        )}
 
        <div className="chat-section">
          <div className="chat-header">
            <MessageSquare size={16}/>
            <span>Ask your data anything</span>
            <span className="chat-badge">Cited answers</span>
            {provStatus && (
              <span className="chat-provider-badge" style={{
                background:`${PROVIDER_META[provStatus.active_provider]?.color}15`,
                color:PROVIDER_META[provStatus.active_provider]?.color,
                borderColor:`${PROVIDER_META[provStatus.active_provider]?.color}40`,
              }}>
                <Activity size={10}/>
                {PROVIDER_META[provStatus.active_provider]?.short||'AI'}
              </span>
            )}
          </div>
 
          <div className="chat-messages">
            {messages.length===0 && (
              <div className="chat-empty">
                <BrainIcon/>
                <p>Ask any business question. Every answer is cited from your data.</p>
              </div>
            )}
            {messages.map((msg,i) => (
              <div key={i} className={`chat-msg msg-${msg.role} animate-fade-in`}>
                {msg.role==='ai' && <div className="msg-avatar ai-avatar"><Zap size={12}/></div>}
                <div className={`msg-bubble ${msg.error?'msg-error':''}`}>
                  <p>{msg.text}</p>
                  {msg.sources?.length>0 && (
                    <div className="msg-sources">
                      {msg.sources.map((s,j) => <span key={j} className="source-chip">Chunk {s}</span>)}
                      {msg.provider && <span className="source-chip provider-source-chip">via {PROVIDER_META[msg.provider]?.short}</span>}
                    </div>
                  )}
                </div>
                {msg.role==='user' && <div className="msg-avatar user-avatar">M</div>}
              </div>
            ))}
            {loading && (
              <div className="chat-msg msg-ai">
                <div className="msg-avatar ai-avatar"><Zap size={12}/></div>
                <div className="msg-bubble typing-bubble">
                  <span className="typing-dot" style={{animationDelay:'0s'}}/>
                  <span className="typing-dot" style={{animationDelay:'0.2s'}}/>
                  <span className="typing-dot" style={{animationDelay:'0.4s'}}/>
                </div>
              </div>
            )}
          </div>
 
          <div className="chat-input-row">
            <input className="chat-input" value={question}
              onChange={e=>setQuestion(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&handleAsk()}
              placeholder="e.g. Which product has the highest revenue?"
              disabled={loading}/>
            <button className="chat-send" onClick={()=>handleAsk()} disabled={loading||!question.trim()}>
              {loading ? <Loader2 size={16} className="spin-icon"/> : <Send size={16}/>}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
 
const BrainIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
  </svg>
)