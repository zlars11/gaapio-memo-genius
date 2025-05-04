
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
          "1. Background: The Company delivers bundled goods and services...\n\n" +
          "2. Scope / Purpose: This memo evaluates whether the Company's revenue recognition...\n\n" +
          "3. Accounting Guidance: ASC 606-10-25-1 through 25-5 provides the relevant criteria...\n\n" +
          "4. Analysis: Based on the five-step model, the performance obligation is satisfied...\n\n" +
          "5. Conclusion: The revenue recognition approach complies with ASC 606...\n\n" +
          "6. Financial Statement Impact: The change increases revenue by $2.4M in Q4 2025...\n\n" +
          "7. Disclosures: Footnote 12 will include updated revenue recognition policies..."
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
              "1. Background: The Company delivers bundled goods and services...\n\n" +
              "2. Scope / Purpose: This memo evaluates whether the Company's revenue recognition...\n\n" +
              "3. Accounting Guidance: ASC 606-10-25-1 through 25-5 provides the relevant criteria...\n\n" +
              "4. Analysis: Based on the five-step model, the performance obligation is satisfied...\n\n" +
              "5. Conclusion: The revenue recognition approach complies with ASC 606...\n\n" +
              "6. Financial Statement Impact: The change increases revenue by $2.4M in Q4 2025...\n\n" +
              "7. Disclosures: Footnote 12 will include updated revenue recognition policies..."
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
          w-full max-w-3xl h-auto p-6 md:p-10 
          ${isDark ? 'bg-background/40' : 'bg-white'} 
          rounded-lg transform rotate-[-7deg]
          ${isDark ? 'border border-gray-700' : 'border border-gray-200'}
          ${isDark ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_15px_rgba(0,0,0,0.1)]'}
        `}
        style={{
          fontFamily: 'monospace',
          opacity: 0.85,
          minHeight: '520px', // Increased height for more content
          width: '100%', // Ensure consistent width from the start
        }}
      >
        <div 
          ref={typedElementRef}
          className={`
            font-mono text-sm md:text-base whitespace-pre-wrap text-left
            ${isDark ? 'text-gray-300' : 'text-gray-800'}
          `}
          style={{ lineHeight: 1.6 }}
        ></div>
      </div>
    </div>
  );
};
