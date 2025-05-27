
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

interface MiniAnimatedMemoProps {
  type: "memo" | "disclosure" | "guidance";
}

export const MiniAnimatedMemo = ({ type }: MiniAnimatedMemoProps) => {
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    if (memoContainerRef.current) {
      memoContainerRef.current.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
      memoContainerRef.current.style.borderColor = isDarkMode ? "#333333" : "#e5e7eb";
      memoContainerRef.current.style.boxShadow = isDarkMode 
        ? "0 0 8px rgba(255,255,255,0.05)" 
        : "0 0 8px rgba(0,0,0,0.1)";
    }
  };

  const getContentByType = () => {
    switch (type) {
      case "memo":
        return '<p><strong>ASC 606 MEMO</strong></p><p><strong>Background:</strong> Revenue recognition analysis for bundled software and services...</p><p><strong>Conclusion:</strong> Performance obligations properly identified under ASC 606...</p>';
      case "disclosure":
        return '<p><strong>FOOTNOTE DISCLOSURE</strong></p><p><strong>Revenue Recognition:</strong> The Company recognizes revenue when control transfers...</p><p><strong>Contract Assets:</strong> As of December 31, contract assets totaled $2.4M...</p>';
      case "guidance":
        return '<p><strong>GUIDANCE UPDATE</strong></p><p><strong>New ASU 2024-01:</strong> Amendments to disclosure requirements for income taxes...</p><p><strong>Effective Date:</strong> Annual periods beginning after December 15, 2025...</p>';
      default:
        return '<p>Loading...</p>';
    }
  };

  useEffect(() => {
    applyThemeStyles();
    
    const timer = setTimeout(() => {
      setLoaded(true);
      
      if (typedElementRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: [getContentByType()],
          typeSpeed: 0.5,
          backSpeed: 0,
          showCursor: true,
          cursorChar: '|',
          loop: false,
          contentType: 'html'
        });
      }
    }, Math.random() * 500 + 200); // Stagger the animations
    
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
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, [type]);

  return (
    <div className="mini-memo-container w-full h-full">
      <div 
        ref={memoContainerRef}
        className={`mini-memo-card ${loaded ? 'opacity-100' : 'opacity-0'} w-full h-full transition-opacity duration-300`}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e5e7eb",
          boxShadow: isDark 
            ? "0 0 8px rgba(255,255,255,0.05)" 
            : "0 0 8px rgba(0,0,0,0.1)",
          border: "1px solid",
          borderRadius: "8px",
          padding: "8px",
          fontSize: "8px",
          lineHeight: "1.2",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div 
          ref={typedElementRef}
          style={{
            color: isDark ? '#FFFFFF' : '#333',
            fontSize: "8px",
            lineHeight: "1.2"
          }}
        ></div>
      </div>
    </div>
  );
};
