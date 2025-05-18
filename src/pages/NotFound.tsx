
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

// Extended debug info to help diagnose blank screen issues
function DiagnoseSystem() {
  const [systemInfo, setSystemInfo] = useState<Record<string, any>>({
    browserInfo: {},
    storageStatus: {},
    networkStatus: {},
    rendering: {}
  });

  useEffect(() => {
    // Collect extensive system information
    const info: Record<string, any> = {
      browserInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookiesEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        maxTouchPoints: navigator.maxTouchPoints,
      },
      storageStatus: {},
      networkStatus: {},
      rendering: {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isDark: document.documentElement.classList.contains("dark"),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cssTransforms: 'transform' in document.documentElement.style || 
                       'webkitTransform' in document.documentElement.style,
      }
    };

    // Check localStorage
    try {
      const testKey = "test_local_storage";
      localStorage.setItem(testKey, "test");
      info.storageStatus.localStorageWorks = localStorage.getItem(testKey) === "test";
      localStorage.removeItem(testKey);
      info.storageStatus.localStorageKeys = Object.keys(localStorage);
      info.storageStatus.localStorageSize = JSON.stringify(localStorage).length;
    } catch (e) {
      info.storageStatus.localStorageWorks = false;
      info.storageStatus.localStorageError = String(e);
    }
    
    // Check sessionStorage
    try {
      const testKey = "test_session_storage";
      sessionStorage.setItem(testKey, "test");
      info.storageStatus.sessionStorageWorks = sessionStorage.getItem(testKey) === "test";
      sessionStorage.removeItem(testKey);
      info.storageStatus.sessionStorageSize = JSON.stringify(sessionStorage).length;
    } catch (e) {
      info.storageStatus.sessionStorageWorks = false;
      info.storageStatus.sessionStorageError = String(e);
    }

    // Network diagnostics
    const runNetworkDiagnostics = async () => {
      try {
        // Simple connectivity check with a timestamp to prevent caching
        const startTime = performance.now();
        const response = await fetch(`/favicon.ico?_=${Date.now()}`);
        const endTime = performance.now();
        
        info.networkStatus.connected = true;
        info.networkStatus.responseTime = Math.round(endTime - startTime);
        info.networkStatus.status = response.status;
        info.networkStatus.statusText = response.statusText;
      } catch (e) {
        info.networkStatus.connected = false;
        info.networkStatus.error = String(e);
      }
      setSystemInfo(info);
    };

    runNetworkDiagnostics();
  }, []);

  return systemInfo;
}

export default function NotFound() {
  const location = useLocation();
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const systemInfo = DiagnoseSystem();

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
      timestamp: new Date().toISOString(),
      referrer: document.referrer || 'none',
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
          
          <h3 className="text-lg font-medium mt-6 mb-2">System Diagnostics</h3>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(systemInfo, null, 2)}
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
          
          <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
            <h4 className="text-md font-medium mb-2">Test LocalStorage</h4>
            <Button 
              onClick={() => {
                try {
                  localStorage.setItem("test_write", new Date().toISOString());
                  alert("LocalStorage write successful: " + localStorage.getItem("test_write"));
                } catch (e) {
                  alert("LocalStorage write failed: " + String(e));
                }
              }}
              size="sm"
              variant="outline"
              className="mr-2"
            >
              Test Write
            </Button>
            <Button 
              onClick={() => {
                try {
                  localStorage.clear();
                  alert("LocalStorage cleared successfully");
                } catch (e) {
                  alert("LocalStorage clear failed: " + String(e));
                }
              }}
              size="sm"
              variant="destructive"
            >
              Clear Storage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
