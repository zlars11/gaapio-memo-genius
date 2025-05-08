
import { useEffect, useState, memo } from "react";

// Ensures massive sizing, day/night mode support, optimized for header
export const Logo = memo(({ className = "" }: { className?: string }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches || document.documentElement.classList.contains("dark"));
    };
    darkModeQuery.addEventListener("change", handleChange);
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    const handleStorageEvent = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Massive logo (white for dark, black for light)
  const darkModeLogo = "/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png";
  const lightModeLogo = "/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png";

  return (
    <img
      src={isDark ? darkModeLogo : lightModeLogo}
      alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
      width={800}
      height={240}
      className={`h-auto w-auto max-w-[400px] sm:max-w-[450px] md:max-w-[500px] block object-contain transition-all duration-200 ${className}`}
      loading="eager"
      decoding="async"
      draggable={false}
      style={{ 
        maxHeight: className.includes("h-12") ? "100px" : 
                 (className.includes("h-14") ? "120px" : 
                 (className.includes("h-16") ? "140px" : "240px")) 
      }}
    />
  );
});
Logo.displayName = 'Logo';
