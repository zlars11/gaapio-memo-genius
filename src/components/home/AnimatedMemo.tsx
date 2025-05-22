
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const AnimatedMemo = () => {
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [isDark, setIsDark] = useState(false);
  const isMobile = useIsMobile();
  const isSmallScreen = !useMediaQuery("md");

  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  };

  useEffect(() => {
    applyThemeStyles();

    if (typedElementRef.current) {
      typedInstanceRef.current = new Typed(typedElementRef.current, {
        strings: [
          `<p><strong>ASC 606 ACCOUNTING MEMO</strong></p>
          <p>&nbsp;</p>
          <p><strong>1. Background</strong><br />The Company delivers bundled goods and services across multiple contracts, including software, implementation support, and optional renewal terms. The performance obligations may be distinct or combined depending on integration level.</p>
          <p><strong>2. Scope / Purpose</strong><br />This memo evaluates whether the Company's revenue recognition practices are in compliance with ASC 606, specifically in relation to bundled offerings that span software licensing, service delivery, and customer training components.</p>
          <p><strong>3. Accounting Guidance</strong><br />ASC 606-10-25-1 through 25-5 provides the framework for identifying performance obligations and determining when control transfers. This guidance mandates an evaluation of the contract terms, delivery mechanisms, and whether standalone value exists.</p>
          <p><strong>4. Analysis</strong><br />Based on the five-step revenue recognition model, each contract was reviewed to determine whether obligations are distinct. In most cases, software licenses are transferred at a point in time, while services are delivered over time under a separate obligation.</p>
          <p><strong>5. Conclusion</strong><br />The Company's revenue accounting treatment aligns with ASC 606, as performance obligations are properly identified, transaction prices allocated, and revenue is recognized at the appropriate time based on delivery and control transfer criteria.</p>
          <p><strong>6. Financial Statement Impact</strong><br />The Company expects to recognize approximately $2.4M in Q4 FY25 related to bundled contracts, with roughly 80% of this revenue allocated to point-in-time obligations and the remainder deferred and recognized over the service term.</p>
          <p><strong>7. Disclosures</strong><br />Footnote 12 in the Company's financial statements will be updated to reflect enhanced revenue recognition disclosures, including timing, methods of recognition, and segmentation of contract components under ASC 606.</p>`
        ],
        typeSpeed: 0.2,
        backSpeed: 0,
        showCursor: true,
        cursorChar: "|",
        loop: false,
        contentType: "html",
      });
    }

    const observer = new MutationObserver(() => applyThemeStyles());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", applyThemeStyles);

    return () => {
      window.removeEventListener("storage", applyThemeStyles);
      observer.disconnect();
      typedInstanceRef.current?.destroy();
    };
  }, []);

  const calculateFontSize = () =>
    isSmallScreen ? "clamp(10px, 1.5vw, 14px)" : "clamp(14px, 2vw, 18px)";

  const calculatePadding = () =>
    isSmallScreen ? "clamp(1rem, 4vw, 2rem)" : "clamp(2rem, 5vw, 3rem)";

  return (
    <div className="relative w-full flex justify-center items-center px-4 py-8 overflow-visible min-h-[900px]">
      <div
        className="relative w-full max-w-[2500px] transform rotate-[-2deg]"
        style={{ minHeight: isSmallScreen ? "800px" : "1000px" }}
      >
        {/* Background UI */}
        <img
          src={
            isDark
              ? "/assets/images/gaapio-app-dark.png"
              : "/assets/images/gaapio-app.png"
          }
          alt="Gaapio UI"
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />

        {/* Memo Box */}
        <div
          className="absolute"
          style={{
            top: isSmallScreen ? "14%" : "18%",
            left: isSmallScreen ? "24%" : "30%",
            right: isSmallScreen ? "5%" : "10%",
            height: "70%",
            padding: calculatePadding(),
            fontSize: calculateFontSize(),
            lineHeight: "1.6",
            color: isDark ? "#FFFFFF" : "#333",
            fontFamily: "system-ui, -apple-system, sans-serif",
            transform: `rotate(-0.5deg) scale(${isSmallScreen ? "0.95" : "1"})`,
            transformOrigin: "top left",
            overflowY: "auto",
            backgroundColor: isDark
              ? "rgba(26, 26, 26, 0.97)"
              : "rgba(255, 255, 255, 0.97)",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
          }}
        >
          <div ref={typedElementRef}></div>
        </div>
      </div>
    </div>
  );
};
