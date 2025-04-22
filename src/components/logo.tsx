
import { useEffect, useState, memo } from "react";

// Ensures correct sizing, day/night mode support, optimized for header
export const Logo = memo(({ className = "h-12 w-auto" }: { className?: string }) => {
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

  // Use the black logo for light mode and white for dark mode
  const darkModeLogo = "/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png"; // White logo
  const lightModeLogo = "/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png"; // Black logo

  return (
    <img 
      src={isDark ? darkModeLogo : lightModeLogo}
      alt="Gaapio Logo - AI-Powered Accounting Memo Platform" 
      width={185} 
      height={48} 
      className={className + " block object-contain"}
      loading="eager"
      decoding="async"
      draggable={false}
      style={{ maxHeight: "48px", minWidth: "135px" }}
    />
  );
});

Logo.displayName = 'Logo';
