
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'  // Make sure App.css is imported
import { ThemeProvider } from './components/theme-toggle.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// Add console log to confirm script execution
console.log("Initializing application...");

createRoot(rootElement).render(
  <ErrorBoundary fallback={
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Application Error</h1>
      <p className="mb-4">The application failed to initialize. Please check the console for more details.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Page
      </button>
    </div>
  }>
    <ThemeProvider defaultTheme="system" storageKey="gaapio-theme">
      <App />
    </ThemeProvider>
  </ErrorBoundary>
);
