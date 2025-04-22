
import { useEffect, useState, memo } from "react";

// Ensures large sizing, day/night mode support, optimized for header
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

  // Large logo (white for dark, black for light)
  const darkModeLogo = "/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png"; // White logo
  const lightModeLogo = "/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png"; // Black logo

  return (
    <img 
      src={isDark ? darkModeLogo : lightModeLogo}
      alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
      width={250}
      height={75}
      className={`h-[75px] w-auto max-w-[340px] min-w-[170px] block object-contain transition-all duration-200 ${className}`}
      loading="eager"
      decoding="async"
      draggable={false}
      style={{ maxHeight: "75px", minWidth: "170px" }}
    />
  );
});
Logo.displayName = 'Logo';
