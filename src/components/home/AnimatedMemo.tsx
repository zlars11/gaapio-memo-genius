
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

export const AnimatedMemo = () => {
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
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
      
      // Initialize typed.js after loading delay
      if (typedElementRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: [
            'Revenue Recognition Technical Memo\n\nBackground:\nThe Company enters into contracts with customers to provide software licenses and implementation services.\n\nTechnical Analysis:\nUnder ASC 606, we have determined that the software license represents a distinct performance obligation. The license provides the customer with a right to use the software, for which revenue is recognized at a point in time when control is transferred to the customer.\n\nThe implementation services represent a separate performance obligation, as they are not highly interdependent with the software license. Revenue for implementation services is recognized over time as the services are performed and the customer simultaneously receives and consumes the benefits.'
          ],
          typeSpeed: 20,
          showCursor: true,
          cursorChar: '|',
          loop: false
        });
      }
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
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
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
          position: 'relative'
        }}
      >
        <img 
          src="/assets/images/gaapio-app.png" 
          alt="Gaapio Revenue Recognition UI" 
          className="w-full h-auto object-cover"
        />
        
        {/* Overlay with typing animation */}
        <div 
          className="absolute top-[122px] left-[50px] right-[400px] bottom-[80px] overflow-auto text-left"
          style={{
            padding: '16px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          <div ref={typedElementRef}></div>
        </div>
      </div>
    </div>
  );
};
