
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

  // Updated logo files (first image for dark mode, second for light mode)
  const darkModeLogo = "/lovable-uploads/522c7538-8543-4c1f-a4ff-b2be3d03805c.png";
  const lightModeLogo = "/lovable-uploads/5a85f12c-b6a6-4899-bc04-f7d2df82477c.png";

  return (
    <img
      src={isDark ? darkModeLogo : lightModeLogo}
      alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
      width={480}
      height={144}
      className={`h-auto w-auto max-h-28 md:max-h-32 object-contain transition-all duration-200 ${className}`}
      loading="eager"
      decoding="async"
      draggable={false}
    />
  );
});
Logo.displayName = 'Logo';
