
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const AnimatedMemo = () => {
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();
  const isSmallScreen = !useMediaQuery('md');
  const [isDark, setIsDark] = useState(false);
  
  // Apply theme styles directly using JavaScript
  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    if (memoContainerRef.current) {
      memoContainerRef.current.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
      memoContainerRef.current.style.borderColor = isDarkMode ? "#333333" : "#e5e7eb";
      memoContainerRef.current.style.boxShadow = isDarkMode 
        ? "0 0 15px rgba(255,255,255,0.05)" 
        : "0 0 15px rgba(0,0,0,0.1)";
    }
  };

  useEffect(() => {
    // ... rest of the useEffect code remains the same ...
  }, []);

  // Calculate responsive font size based on viewport width
  const calculateFontSize = () => {
    if (isSmallScreen) {
      return 'clamp(10px, 1.8vw, 14px)';
    }
    return 'clamp(14px, 2.2vw, 18px)';
  };

  // Calculate responsive padding based on viewport width
  const calculatePadding = () => {
    if (isSmallScreen) {
      return 'clamp(1.5rem, 4vw, 2.5rem)';
    }
    return 'clamp(2.5rem, 5vw, 3.5rem)';
  };

  return (
    <div className="flex items-center justify-center w-screen min-h-screen py-8 px-4">
      <div 
        ref={memoContainerRef}
        className={`w-full rounded-lg transform rotate-[-2deg] border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          position: 'relative',
          aspectRatio: '16/9',
          width: isSmallScreen ? '95vw' : '90vw',
          maxWidth: '2000px',
          minHeight: isSmallScreen ? '600px' : '800px',
          overflow: 'hidden'
        }}
      >
        <img 
          src={isDark ? "/assets/images/gaapio-app-dark.png" : "/assets/images/gaapio-app.png"}
          alt="Gaapio Revenue Recognition UI" 
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            transform: 'scale(1.02)' // Slight scale to prevent white edges during rotation
          }}
        />
        
        <div 
          className="absolute text-left"
          style={{
            top: isSmallScreen ? '15%' : '20%',
            left: isSmallScreen ? '10%' : '15%',
            width: isSmallScreen ? '80%' : '70%',
            height: 'auto',
            maxHeight: '70%',
            padding: calculatePadding(),
            fontSize: calculateFontSize(),
            lineHeight: '1.6',
            color: isDark ? '#FFFFFF' : '#333',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: `rotate(-.5deg) scale(${isSmallScreen ? '0.95' : '1'})`,
            transformOrigin: 'top left',
            overflowY: 'auto',
            backgroundColor: isDark ? 'rgba(26, 26, 26, 0.97)' : 'rgba(255, 255, 255, 0.97)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div ref={typedElementRef}></div>
        </div>
      </div>
    </div>
  );
};

