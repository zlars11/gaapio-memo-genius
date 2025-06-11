import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const AnimatedMemoRight = () => {
  const { width } = useWindowSize();
  const memoContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const getScale = () => {
    if (width < 480) return 0.35;
    if (width < 768) return 0.5;
    if (width < 1024) return 0.6;
    return 0.7;
  };

  const getTopPosition = () => {
    if (width < 480) return "85px";
    if (width < 768) return "110px";
    return "205px";
  };

  const getContainerWidth = () => {
    if (width < 480) return "175%";
    if (width < 768) return "150%";
    return "175%";
  };

  const getLeftPosition = () => {
    if (width < 480) return "23%";
    if (width < 768) return "23%";
    return "23%";
  };

  const getContainerHeight = () => {
    if (width < 480) return "calc(220% - 170px)";
    if (width < 768) return "calc(200% - 170px)";
    return "calc(140% - 170px)";
  };

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
            '<p><strong>ASC 606 ACCOUNTING MEMO</strong></p>\n<p><strong>1. Background</strong><br />The Company delivers bundled goods and services across multiple contracts, including software, implementation support, and optional renewal terms. The performance obligations may be distinct or combined depending on integration level.</p>\n\n<p><strong>2. Scope / Purpose</strong><br />This memo evaluates whether the Company\'s revenue recognition practices are in compliance with ASC 606, specifically in relation to bundled offerings that span software licensing, service delivery, and customer training components.</p>\n\n<p><strong>3. Accounting Guidance</strong><br />ASC 606-10-25-1 through 25-5 provides the framework for identifying performance obligations and determining when control transfers. This guidance mandates an evaluation of the contract terms, delivery mechanisms, and whether standalone value exists.</p>\n\n<p><strong>4. Analysis</strong><br />Based on the five-step revenue recognition model, each contract was reviewed to determine whether obligations are distinct. In most cases, software licenses are transferred at a point in time, while services are delivered over time under a separate obligation.</p>\n\n<p><strong>5. Conclusion</strong><br />The Company\'s revenue accounting treatment aligns with ASC 606, as performance obligations are properly identified, transaction prices allocated, and revenue is recognized at the appropriate time based on delivery and control transfer criteria.</p>\n\n<p><strong>6. Financial Statement Impact</strong><br />The Company expects to recognize approximately $2.4M in Q4 FY25 related to bundled contracts, with roughly 80% of this revenue allocated to point-in-time obligations and the remainder deferred and recognized over the service term.</p>\n\n<p><strong>7. Disclosures</strong><br />Footnote 12 in the Company\'s financial statements will be updated to reflect enhanced revenue recognition disclosures, including timing, methods of recognition, and segmentation of contract components under ASC 606.</p>'
          ],
          typeSpeed: 0.5,
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

  return (
    <div
      className="memo-animation-container"
      style={{
        position: 'relative',
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        ref={memoContainerRef}
        className={`memo-card ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e5e7eb",
          boxShadow: isDark
            ? "0 0 15px rgba(255,255,255,0.05)"
            : "0 0 15px rgba(0,0,0,0.1)",
          maxWidth: "850px",
          width: "100%",
          border: "1px solid",
          borderRadius: "8px",
          position: "relative",
          transformOrigin: "center",
        }}
      >
        <img
          src={isDark ? "/assets/images/gaapio-app-dark-right.png" : "/assets/images/gaapio-app_right.png"}
          alt="Gaapio Revenue Recognition UI"
          className="memo-background-image"
          loading="eager"
          fetchPriority="high"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            borderRadius: "8px"
          }}
        />

        <div
          className="memo-text-overlay"
          style={{
            position: "absolute",
            top: getTopPosition(),
            left: getLeftPosition(),
            right: "2.5%",
            textAlign: "left",
            lineHeight: "1.2",
            zIndex: 10,
            height: getContainerHeight(),
            display: "flex",
            alignItems: "flex-start",
            width: getContainerWidth()
          }}
        >
          <div
            ref={typedElementRef}
            className="memo-text"
            style={{
              color: isDark ? '#FFFFFF' : '#333',
              backgroundColor: isDark ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
              padding: '4px',
              borderRadius: '4px',
              width: '100%',
              fontSize: '12px',
              transform: `scale(${getScale()})`,
              transformOrigin: 'top left',
              whiteSpace: 'pre-wrap',
              maxHeight: `${100 / getScale()}%`,
              overflow: 'hidden'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
