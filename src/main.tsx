
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'
import { ThemeProvider } from './components/theme-toggle.tsx'
import { Toaster } from './components/ui/toaster'

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <ThemeProvider>
    <App />
    <Toaster />
  </ThemeProvider>
)
