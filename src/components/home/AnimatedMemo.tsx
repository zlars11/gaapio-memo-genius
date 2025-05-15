
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

export const AnimatedMemo = () => {
  const typedElementRef = useRef<HTMLDivElement>(null);
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typed = useRef<Typed | null>(null);
  const [memoCompleted, setMemoCompleted] = useState(false);
  const [footnoteVisible, setFootnoteVisible] = useState(false);
  const footnoteRef = useRef<HTMLDivElement>(null);
  const footnoteTypedRef = useRef<Typed | null>(null);

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

    if (footnoteRef.current) {
      // Apply styles to the footnote
      footnoteRef.current.style.color = isDark ? "#e5e7eb" : "#1f2937";
      
      // Apply specific styles to horizontal rule in different themes
      const hr = footnoteRef.current.querySelector('hr');
      if (hr) {
        hr.style.borderColor = isDark ? "#444444" : "#000000";
      }
    }
  };

  useEffect(() => {
    // Initialize typed.js for the main memo
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
        typeSpeed: 12, // 2x faster than previous setting (24)
        backSpeed: 0,
        loop: false,
        showCursor: true,
        cursorChar: "|",
        startDelay: 600,
        smartBackspace: false,
        onComplete: () => {
          setMemoCompleted(true);
        }
      });
      
      // Apply theme styles immediately after initialization
      applyThemeStyles();
    }

    // Clean up
    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
      if (footnoteTypedRef.current) {
        footnoteTypedRef.current.destroy();
      }
    };
  }, []);

  // Initialize the footnote typing once the memo is completed
  useEffect(() => {
    if (memoCompleted && footnoteRef.current && !footnoteVisible) {
      // Small delay before showing footnote section
      const timer = setTimeout(() => {
        setFootnoteVisible(true);
        
        // Initialize typed.js for the footnote section
        const footnoteElement = footnoteRef.current.querySelector('.footnote-content');
        if (footnoteElement) {
          footnoteTypedRef.current = new Typed(footnoteElement as HTMLElement, {
            strings: ["The Company recognizes revenue in accordance with ASC 606 when control of goods or services transfers to the customer. Revenue is typically recognized at a point in time upon shipment or delivery."],
            typeSpeed: 18, // A bit faster than main memo for better flow
            backSpeed: 0,
            loop: false,
            showCursor: true,
            cursorChar: "|",
            startDelay: 800, // Slight delay after the divider appears
            smartBackspace: false,
          });
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [memoCompleted, footnoteVisible]);

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
        className="w-[900px] max-w-full h-auto p-6 md:p-10 bg-white rounded-lg transform rotate-[-7deg] border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
        style={{
          fontFamily: 'monospace',
          opacity: 0.85,
          minHeight: '600px',
          maxHeight: '700px',
          overflowY: 'visible',
          transition: 'all 0.3s ease',
        }}
      >
        <div 
          ref={typedElementRef}
          className="font-mono text-sm md:text-base whitespace-pre-wrap text-left text-gray-800"
          style={{ lineHeight: 1.6 }}
        ></div>
        
        {memoCompleted && (
          <div 
            ref={footnoteRef} 
            className={`mt-6 text-left transition-opacity duration-500 ${footnoteVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <hr className="border-t border-black my-4" />
            
            <div className="footnote-header font-serif font-bold text-lg mb-2">
              Note 2 — Revenue Recognition
            </div>
            
            <div 
              className="footnote-content font-serif text-sm md:text-base text-justify"
              style={{ 
                textIndent: '1.5em',
                lineHeight: 1.6 
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
