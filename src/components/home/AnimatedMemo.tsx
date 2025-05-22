
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
  const isSmallScreen = !useMediaQuery("md");
  const [isDark, setIsDark] = useState(false);

  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  };

  useEffect(() => {
    applyThemeStyles();

    const timer = setTimeout(() => {
      setLoaded(true);

      if (typedElementRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: [/* same content omitted for brevity */],
          typeSpeed: 0.2,
          backSpeed: 0,
          showCursor: true,
          cursorChar: "|",
          loop: false,
          contentType: "html",
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

    window.addEventListener("storage", applyThemeStyles);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener("storage", applyThemeStyles);
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, []);

  const calculateFontSize = () => {
    return isSmallScreen ? "clamp(10px, 1.5vw, 14px)" : "clamp(14px, 2vw, 18px)";
  };

  const calculatePadding = () => {
    return isSmallScreen ? "clamp(1rem, 4vw, 2rem)" : "clamp(2rem, 5vw, 3rem)";
  };

  return (
    <div className="relative w-full overflow-hidden flex justify-center items-center px-4 py-8">
      <div
        className="relative w-full max-w-[2500px] transform rotate-[-2deg] transition-opacity duration-500"
        style={{
          aspectRatio: "16/9",
          opacity: loaded ? 1 : 0,
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
