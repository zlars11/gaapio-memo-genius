
import { useEffect, useRef, useState } from "react";

interface MiniAnimatedMemoProps {
  type: "memo" | "disclosure" | "guidance";
}

export const MiniAnimatedMemo = ({ type }: MiniAnimatedMemoProps) => {
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  };

  useEffect(() => {
    applyThemeStyles();
    
    const timer = setTimeout(() => {
      setLoaded(true);
    }, Math.random() * 300 + 100); // Faster stagger for mini version
    
    const observer = new MutationObserver(() => {
      applyThemeStyles();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    const handleStorageEvent = () => {
      applyThemeStyles();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [type]);

  return (
    <div className="mini-memo-container w-full h-full">
      <div 
        className={`mini-memo-card ${loaded ? 'opacity-100' : 'opacity-0'} w-full h-full transition-opacity duration-300 rounded-lg overflow-hidden relative`}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          border: `1px solid ${isDark ? "#333333" : "#e5e7eb"}`,
          boxShadow: isDark 
            ? "0 0 4px rgba(255,255,255,0.05)" 
            : "0 0 4px rgba(0,0,0,0.1)"
        }}
      >
        <img
          src={isDark ? "/assets/images/gaapio-app-dark.png" : "/assets/images/gaapio-app.png"}
          alt="Gaapio App Interface"
          className="w-full h-full object-cover object-top"
          style={{
            transform: "scale(1.2)",
            transformOrigin: "top left"
          }}
        />
        
        {/* Overlay with subtle gradient */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isDark 
              ? "linear-gradient(135deg, rgba(51, 156, 255, 0.1) 0%, rgba(26, 26, 26, 0.3) 100%)"
              : "linear-gradient(135deg, rgba(51, 156, 255, 0.05) 0%, rgba(255, 255, 255, 0.2) 100%)"
          }}
        />
      </div>
    </div>
  );
};
