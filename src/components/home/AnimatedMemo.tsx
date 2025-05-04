
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
          "ASC 606 ACCOUNTING MEMO\n\n1. Background: The Company recognizes revenue when control of the promised goods...\n\n2. Analysis: Based on the five-step model outlined in ASC 606...\n\n3. Conclusion: The Company's revenue recognition policy is in compliance with..."
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
              "ASC 606 ACCOUNTING MEMO\n\n1. Background: The Company recognizes revenue when control of the promised goods...\n\n2. Analysis: Based on the five-step model outlined in ASC 606...\n\n3. Conclusion: The Company's revenue recognition policy is in compliance with..."
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
    <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
      <div 
        className={`
          w-[90%] max-w-3xl h-auto p-6 md:p-10 
          ${isDark ? 'bg-background/40' : 'bg-white'} 
          rounded-lg shadow-lg transform rotate-[-7deg]
          ${isDark ? 'border border-gray-700' : 'border border-gray-200'}
          ${isDark ? 'shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'shadow-[0_0_15px_rgba(0,0,0,0.1)]'}
        `}
        style={{
          fontFamily: 'monospace',
          opacity: 0.85,
          minHeight: '340px',
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
