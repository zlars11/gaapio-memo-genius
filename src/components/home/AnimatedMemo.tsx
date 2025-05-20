
import { useEffect, useRef, useState } from "react";

export const AnimatedMemo = () => {
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  // Apply theme styles directly using JavaScript
  const applyThemeStyles = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (memoContainerRef.current) {
      // Apply styles to the memo container
      memoContainerRef.current.style.backgroundColor = isDark ? "#1a1a1a" : "#ffffff";
      memoContainerRef.current.style.borderColor = isDark ? "#333333" : "#e5e7eb";
      memoContainerRef.current.style.boxShadow = isDark 
        ? "0 0 15px rgba(255,255,255,0.05)" 
        : "0 0 15px rgba(0,0,0,0.1)";
    }
  };

  useEffect(() => {
    // Apply theme once when component mounts
    applyThemeStyles();
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);
    
    // Set up observer to watch for theme changes
    const observer = new MutationObserver(() => {
      applyThemeStyles();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    // Listen for storage events (for theme changes from other tabs)
    const handleStorageEvent = () => {
      applyThemeStyles();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return (
    <div className="flex items-center justify-center overflow-visible">
      <div 
        ref={memoContainerRef}
        className={`w-[900px] max-w-full p-0 rounded-lg transform rotate-[-7deg] border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          minHeight: '560px', 
          overflow: 'hidden',
        }}
      >
        <img 
          src="/assets/images/gaapio-app.png" 
          alt="Gaapio Revenue Recognition UI" 
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
};
