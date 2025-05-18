
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './App.css'  // Make sure App.css is imported
import { ThemeProvider } from './components/theme-toggle.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { Toaster } from './components/ui/toaster'

// Set up global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Don't prevent default, just log it
});

// Set up unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Don't prevent default, just log it
});

// Add console log to confirm script execution
console.log("Initializing application...");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

function InitializeApp() {
  // Wrap in try-catch to handle any initialization errors
  try {
    return (
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
          <Toaster />
        </ThemeProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Critical error during app initialization:", error);
    return (
      <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Critical Application Error</h1>
        <p className="mb-4">The application encountered a critical error during initialization.</p>
        <p className="mb-4 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          {error instanceof Error ? error.message : String(error)}
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    );
  }
}

// Use a try-catch when rendering to catch any render errors
try {
  createRoot(rootElement).render(<InitializeApp />);
  console.log("Application rendered successfully");
} catch (error) {
  console.error("Failed to render the application:", error);
  rootElement.innerHTML = `
    <div class="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 class="text-2xl font-bold mb-4 text-red-600">Rendering Error</h1>
      <p class="mb-4">Failed to render the application. Please try refreshing the page.</p>
      <div class="mb-4 overflow-auto max-h-40 p-2 bg-gray-100 dark:bg-gray-800 rounded">
        ${error instanceof Error ? error.message : String(error)}
      </div>
      <button 
        onclick="window.location.reload()" 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Page
      </button>
    </div>
  `;
}
