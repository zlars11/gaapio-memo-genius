
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
    applyThemeStyles();
    
    const timer = setTimeout(() => {
      setLoaded(true);
      
      if (typedElementRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: [
            '<p><strong>ASC 606 ACCOUNTING MEMO</strong></p>\n\n<p>&nbsp;</p>\n\n<p><strong>1. Background</strong><br />The Company delivers bundled goods and services across multiple contracts, including software, implementation support, and optional renewal terms. The performance obligations may be distinct or combined depending on integration level.</p>\n\n<p><strong>2. Scope / Purpose</strong><br />This memo evaluates whether the Company\'s revenue recognition practices are in compliance with ASC 606, specifically in relation to bundled offerings that span software licensing, service delivery, and customer training components.</p>\n\n<p><strong>3. Accounting Guidance</strong><br />ASC 606-10-25-1 through 25-5 provides the framework for identifying performance obligations and determining when control transfers. This guidance mandates an evaluation of the contract terms, delivery mechanisms, and whether standalone value exists.</p>\n\n<p><strong>4. Analysis</strong><br />Based on the five-step revenue recognition model, each contract was reviewed to determine whether obligations are distinct. In most cases, software licenses are transferred at a point in time, while services are delivered over time under a separate obligation.</p>\n\n<p><strong>5. Conclusion</strong><br />The Company\'s revenue accounting treatment aligns with ASC 606, as performance obligations are properly identified, transaction prices allocated, and revenue is recognized at the appropriate time based on delivery and control transfer criteria.</p>\n\n<p><strong>6. Financial Statement Impact</strong><br />The Company expects to recognize approximately $2.4M in Q4 FY25 related to bundled contracts, with roughly 80% of this revenue allocated to point-in-time obligations and the remainder deferred and recognized over the service term.</p>\n\n<p><strong>7. Disclosures</strong><br />Footnote 12 in the Company\'s financial statements will be updated to reflect enhanced revenue recognition disclosures, including timing, methods of recognition, and segmentation of contract components under ASC 606.</p>'
          ],
          typeSpeed: .2,
          backSpeed: 0,
          showCursor: true,
          cursorChar: '|',
          loop: false,
          contentType: 'html'
        });
      }
    }, 100);
    
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
  }, []);

  const calculateFontSize = () => {
    if (isSmallScreen) {
      return 'clamp(10px, 1.8vw, 14px)';
    }
    return 'clamp(14px, 2.2vw, 18px)';
  };

  const calculatePadding = () => {
    if (isSmallScreen) {
      return 'clamp(1.5rem, 4vw, 2.5rem)';
    }
    return 'clamp(2.5rem, 5vw, 3.5rem)';
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={isDark ? "/assets/images/gaapio-app-dark.png" : "/assets/images/gaapio-app.png"}
          alt="Gaapio Revenue Recognition UI" 
          className="w-full h-full object-cover"
          style={{
            transform: 'scale(1.1)',
          }}
        />
      </div>

      <div className="relative w-full h-full flex items-center justify-center p-8">
        <div 
          ref={memoContainerRef}
          className={`w-[95vw] max-w-[2500px] rounded-lg border border-gray-200 transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            aspectRatio: '16/9',
            minHeight: isSmallScreen ? '800px' : '1000px',
            transform: 'rotate(-2deg)',
            position: 'relative',
            backgroundColor: isDark ? 'rgba(26, 26, 26, 0.2)' : 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div 
            className="absolute text-left"
            style={{
              top: isSmallScreen ? '15%' : '20%',
              left: isSmallScreen ? '25%' : '30%',
              right: isSmallScreen ? '5%' : '8%',
              height: 'auto',
              maxHeight: '75%',
              padding: calculatePadding(),
              fontSize: calculateFontSize(),
              lineHeight: '1.6',
              color: isDark ? '#FFFFFF' : '#333',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              transform: 'rotate(0.5deg)',
              transformOrigin: 'top left',
              overflowY: 'auto',
              backgroundColor: isDark ? 'rgba(26, 26, 26, 0.97)' : 'rgba(255, 255, 255, 0.97)',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              zIndex: 10
            }}
          >
            <div ref={typedElementRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
