
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'  // Make sure App.css is imported
import { ThemeProvider } from './components/theme-toggle.tsx'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <ThemeProvider defaultTheme="system" storageKey="gaapio-theme">
    <App />
  </ThemeProvider>
);
