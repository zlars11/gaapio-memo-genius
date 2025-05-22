
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const AnimatedMemo = () => {
  const memoRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [isDark, setIsDark] = useState(false);
  const isSmallScreen = !useMediaQuery("md");

  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  };

  useEffect(() => {
    applyThemeStyles();

    if (typedRef.current) {
      typedInstanceRef.current = new Typed(typedRef.current, {
        strings: [
          `ASC 606 ACCOUNTING MEMO

1. Background
The Company delivers bundled goods and services across multiple contracts, including software, implementation support, and optional renewal terms. The performance obligations may be distinct or combined depending on integration level.

2. Scope / Purpose
This memo evaluates whether the Company's revenue recognition practices are in compliance with ASC 606, specifically in relation to bundled offerings that span software licensing, service delivery, and customer training components.

3. Accounting Guidance
ASC 606-10-25-1 through 25-5 provides the framework for identifying performance obligations and determining when control transfers. This guidance mandates an evaluation of the contract terms, delivery mechanisms, and whether standalone value exists.

4. Analysis
Based on the five-step revenue recognition model, each contract was reviewed to determine whether obligations are distinct. In most cases, software licenses are transferred at a point in time, while services are delivered over time under a separate obligation.

5. Conclusion
The Company’s revenue accounting treatment aligns with ASC 606, as performance obligations are properly identified, transaction prices allocated, and revenue is recognized at the appropriate time based on delivery and control transfer criteria.

6. Financial Statement Impact
The Company expects to recognize approximately $2.4M in Q4 FY25 related to bundled contracts, with roughly 80% of this revenue allocated to point-in-time obligations and the remainder deferred and recognized over the service term.

7. Disclosures
Footnote 12 in the Company’s financial statements will be updated to reflect enhanced revenue recognition disclosures, including timing, methods of recognition, and segmentation of contract components under ASC 606.`
        ],
        typeSpeed: 1.5,
        showCursor: true,
        cursorChar: "|",
        loop: false,
      });
    }

    const observer = new MutationObserver(() => applyThemeStyles());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      typedInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden py-8 flex justify-center items-center">
      <div
        className="relative"
        style={{
          width: "100vw",
          maxWidth: "2500px",
          aspectRatio: "16 / 9",
          transform: "rotate(-2deg)",
          overflow: "visible",
        }}
      >
        {/* Background Image */}
        <img
          src={
            isDark
              ? "/assets/images/gaapio-app-dark.png"
              : "/assets/images/gaapio-app.png"
          }
          alt="Gaapio UI"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />

        {/* Memo Overlay */}
        <div
          ref={memoRef}
          className="absolute"
          style={{
            top: "18%",
            left: "30%",
            width: "40%",
            height: "64%",
            fontSize: isSmallScreen ? "clamp(9px, 1.2vw, 13px)" : "clamp(12px, 1.4vw, 15px)",
            padding: isSmallScreen ? "1.25rem" : "2rem",
            backgroundColor: isDark
              ? "rgba(26,26,26,0.95)"
              : "rgba(255,255,255,0.95)",
            color: isDark ? "#fff" : "#333",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `rotate(-0.5deg) scale(${isSmallScreen ? "0.85" : "1"})`,
            transformOrigin: "top left",
            overflow: "hidden",
            lineHeight: "1.55",
            whiteSpace: "pre-wrap",
            zIndex: 10,
          }}
        >
          <div ref={typedRef}></div>
        </div>
      </div>
    </div>
  );
};
