
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Collect debug information about the environment
    const info: Record<string, any> = {
      url: window.location.href,
      pathname: location.pathname,
      userAgent: navigator.userAgent,
      isDarkMode: document.documentElement.classList.contains("dark"),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      hasLocalStorage: !!window.localStorage,
      hasSessionStorage: !!window.sessionStorage,
    };
    
    // Try to check if localStorage is actually working
    try {
      const testKey = "test_local_storage";
      localStorage.setItem(testKey, "test");
      info.localStorageWorks = localStorage.getItem(testKey) === "test";
      localStorage.removeItem(testKey);
    } catch (e) {
      info.localStorageWorks = false;
      info.localStorageError = String(e);
    }
    
    // Check session storage
    try {
      const testKey = "test_session_storage";
      sessionStorage.setItem(testKey, "test");
      info.sessionStorageWorks = sessionStorage.getItem(testKey) === "test";
      sessionStorage.removeItem(testKey);
    } catch (e) {
      info.sessionStorageWorks = false;
      info.sessionStorageError = String(e);
    }
    
    setDebugInfo(info);
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-6xl font-bold mb-6">404</h1>
      <h2 className="text-2xl font-medium mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
        <Button variant="outline" onClick={() => setShowDebug(!showDebug)}>
          {showDebug ? "Hide Debug Info" : "Show Debug Info"}
        </Button>
      </div>
      
      {showDebug && (
        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-left max-w-lg w-full overflow-auto">
          <h3 className="text-lg font-medium mb-2">Debug Information</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          <h4 className="text-md font-medium mt-4 mb-2">Local Storage Keys</h4>
          <div className="text-xs">
            {(() => {
              try {
                return (
                  <ul className="list-disc pl-4">
                    {Object.keys(localStorage).map(key => (
                      <li key={key}>
                        <strong>{key}</strong>: {
                          key.includes('password') ? '[REDACTED]' : 
                          localStorage.getItem(key)?.substring(0, 100) + 
                          (localStorage.getItem(key)?.length || 0 > 100 ? '...' : '')
                        }
                      </li>
                    ))}
                  </ul>
                );
              } catch (e) {
                return <p className="text-red-500">Error accessing localStorage: {String(e)}</p>;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
