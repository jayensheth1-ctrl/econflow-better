import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initTheme } from '@/lib/themeStore'
import { initTheme as initAppTheme } from '@/lib/themeManager'

initTheme()
initAppTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)