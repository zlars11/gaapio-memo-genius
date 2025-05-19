
import { useEffect, useState, memo } from "react";

// Ensures proper sizing, day/night mode support, optimized for header
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

  // Logo files with relative paths for proper asset handling through Vite
  const darkModeLogo = "/assets/images/logo-dark.png";  // Will be processed by Vite
  const lightModeLogo = "/assets/images/logo-light.png"; // Will be processed by Vite

  return (
    <img
      src={isDark ? darkModeLogo : lightModeLogo}
      alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
      width={480}
      height={144}
      className={`h-auto w-auto max-h-28 md:max-h-32 object-contain transition-all duration-200 ${className}`}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      draggable={false}
    />
  );
});
Logo.displayName = 'Logo';
