import { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useTheme } from './hooks/useTheme.js'
 
export default function App() {
  const [activeFile, setActiveFile] = useState(null)
  const [view, setView] = useState('landing')
  const { theme, toggle } = useTheme()
 
  const handleFileUploaded = (meta) => {
    setActiveFile(meta)
    setView('dashboard')
  }
 
  return (
    <div className="app">
      {view === 'landing' ? (
        <Landing onFileUploaded={handleFileUploaded} theme={theme} onThemeToggle={toggle} />
      ) : (
        <Dashboard fileMeta={activeFile} onBack={() => setView('landing')} theme={theme} onThemeToggle={toggle} />
      )}
    </div>
  )
}