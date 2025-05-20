
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
            '<p><strong>ASC 606 ACCOUNTING MEMO</strong></p>\n\n<p>&nbsp;</p>\n\n<p><strong>1. Background</strong><br />The Company delivers bundled goods and services across multiple contracts, including software, implementation support, and optional renewal terms. The performance obligations may be distinct or combined depending on integration level.</p>\n\n<p><strong>2. Scope / Purpose</strong><br />This memo evaluates whether the Company\'s revenue recognition practices are in compliance with ASC 606, specifically in relation to bundled offerings that span software licensing, service delivery, and customer training components.</p>\n\n<p><strong>3. Accounting Guidance</strong><br />ASC 606-10-25-1 through 25-5 provides the framework for identifying performance obligations and determining when control transfers. This guidance mandates an evaluation of the contract terms, delivery mechanisms, and whether standalone value exists.</p>\n\n<p><strong>4. Analysis</strong><br />Based on the five-step revenue recognition model, each contract was reviewed to determine whether obligations are distinct. In most cases, software licenses are transferred at a point in time, while services are delivered over time under a separate obligation.</p>\n\n<p><strong>5. Conclusion</strong><br />The Company\'s revenue accounting treatment aligns with ASC 606, as performance obligations are properly identified, transaction prices allocated, and revenue is recognized at the appropriate time based on delivery and control transfer criteria.</p>\n\n<p><strong>6. Financial Statement Impact</strong><br />The Company expects to recognize approximately $2.4M in Q4 FY25 related to bundled contracts, with roughly 80% of this revenue allocated to point-in-time obligations and the remainder deferred and recognized over the service term.</p>\n\n<p><strong>7. Disclosures</strong><br />Footnote 12 in the Company\'s financial statements will be updated to reflect enhanced revenue recognition disclosures, including timing, methods of recognition, and segmentation of contract components under ASC 606.</p>'
          ],
          typeSpeed: 20,
          showCursor: true,
          cursorChar: '|',
          loop: false,
          contentType: 'html'
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
    <div className="flex items-center justify-center overflow-visible py-8 mx-4">
      <div 
        ref={memoContainerRef}
        className={`w-full max-w-[900px] p-0 rounded-lg transform rotate-[-5deg] border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} overflow-hidden`}
        style={{
          minHeight: isSmallScreen ? '400px' : '560px', 
          position: 'relative'
        }}
      >
        <img 
          src="/assets/images/gaapio-app.png" 
          alt="Gaapio Revenue Recognition UI" 
          className="w-full h-auto object-cover"
        />
        
        {/* Overlay with typing animation - matched angle with the UI */}
        <div 
          className="absolute overflow-y-auto text-left"
          style={{
            top: isSmallScreen ? '120px' : '210px',
            left: isSmallScreen ? '40px' : '190px',
            right: isSmallScreen ? '20px' : '35px',
            bottom: isSmallScreen ? '30px' : '50px',
            padding: isSmallScreen ? '8px 10px' : '10px 14px',
            fontSize: isSmallScreen ? '0.65rem' : '0.75rem',
            lineHeight: 1.2,
            color: '#333',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            transform: 'rotate(-5deg)', // Match the exact angle of the UI
            transformOrigin: 'top left',
            maxHeight: '100%',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div ref={typedElementRef}></div>
        </div>
      </div>
    </div>
  );
};
