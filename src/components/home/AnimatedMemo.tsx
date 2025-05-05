
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export const AnimatedMemo = () => {
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typed = useRef<Typed | null>(null);
  const isDark = document.documentElement.classList.contains("dark");

  useEffect(() => {
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
    }

    // Clean up
    return () => {
      if (typed.current) {
        typed.current.destroy();
      }
    };
  }, []);

  // Add event listener to handle theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      // Force re-render on theme change
      if (typed.current) {
        typed.current.destroy();
        
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
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex items-center justify-center overflow-hidden pointer-events-none">
      <div 
        className={`
          w-[600px] min-w-[600px] max-w-[600px]
          h-auto p-6 md:p-10 
          ${isDark ? 'bg-[#121212]' : 'bg-white'} 
          rounded-lg transform rotate-[-7deg]
          ${isDark ? 'border border-gray-700' : 'border border-gray-200'}
          ${isDark ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_15px_rgba(0,0,0,0.1)]'}
        `}
        style={{
          fontFamily: 'monospace',
          opacity: 0.85,
          minHeight: '520px',
          transition: 'none',
        }}
      >
        <div 
          ref={typedElementRef}
          className={`
            font-mono text-sm md:text-base whitespace-pre-wrap text-left
            ${isDark ? 'text-gray-100' : 'text-gray-800'}
          `}
          style={{ lineHeight: 1.6 }}
        ></div>
      </div>
    </div>
  );
};
