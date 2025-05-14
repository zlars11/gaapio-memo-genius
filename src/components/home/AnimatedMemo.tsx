
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export const AnimatedMemo = () => {
  const typedElementRef = useRef<HTMLDivElement>(null);
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typed = useRef<Typed | null>(null);

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
    
    if (typedElementRef.current) {
      // Apply styles to the typed text
      typedElementRef.current.style.color = isDark ? "#e5e7eb" : "#1f2937";
    }
  };

  useEffect(() => {
    // Initialize typed.js
    if (typedElementRef.current) {
      typed.current = new Typed(typedElementRef.current, {
        strings: [
          "ASC 606 ACCOUNTING MEMO\n\n" +
          "1. Background  \n" +
          "The Company delivers bundled goods and services across multiple contracts...\n\n" +
          "2. Scope / Purpose  \n" +
          "This memo evaluates whether the Company's revenue recognition complies with ASC 606.\n\n" +
          "3. Accounting Guidance  \n" +
          "ASC 606-10-25-1 through 25-5 provides the relevant criteria for revenue recognition...\n\n" +
          "4. Analysis  \n" +
          "Based on the five-step model, the performance obligation is satisfied at a point in time...\n\n" +
          "5. Conclusion  \n" +
          "The Company's accounting treatment is consistent with ASC 606.\n\n" +
          "6. Financial Statement Impact  \n" +
          "The treatment results in $2.4M of revenue recognized in Q4 FY25...\n\n" +
          "7. Disclosures  \n" +
          "Footnote 12 will reflect the updated policy disclosures accordingly."
        ],
        typeSpeed: 40,
        backSpeed: 0,
        loop: false,
        showCursor: true,
        cursorChar: "|",
        startDelay: 1000,
        smartBackspace: false,
      });
      
      // Apply theme styles immediately after initialization
      applyThemeStyles();
    }

    // Clean up
    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, []);

  // Set up observer for theme changes
  useEffect(() => {
    // Apply theme once when component mounts
    applyThemeStyles();
    
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
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return (
    <div className="flex items-center justify-center overflow-hidden pointer-events-none">
      <div 
        ref={memoContainerRef}
        className="w-[800px] max-w-full h-auto p-6 md:p-10 bg-white rounded-lg transform rotate-[-7deg] border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
        style={{
          fontFamily: 'monospace',
          opacity: 0.85,
          minHeight: '600px',  // Increased minimum height to accommodate the full text
          maxHeight: '700px',  // Increased maximum height
          overflowY: 'visible', // Changed from 'hidden' to 'visible' to show overflowing content
          transition: 'all 0.3s ease',
        }}
      >
        <div 
          ref={typedElementRef}
          className="font-mono text-sm md:text-base whitespace-pre-wrap text-left text-gray-800"
          style={{ lineHeight: 1.6 }}
        ></div>
      </div>
    </div>
  );
};
