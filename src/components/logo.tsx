
import { useEffect, useState, memo } from "react";

// Ensures proper sizing, day/night mode support, optimized for header
export const Logo = memo(({ className = "" }: { className?: string }) => {
  const [isDark, setIsDark] = useState(false);
  const [logoError, setLogoError] = useState(false);

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

  // Logo files with correct absolute paths
  const darkModeLogo = "/assets/images/logo-dark.png";
  const lightModeLogo = "/assets/images/logo-light.png";

  const handleImageError = () => {
    console.error("Logo image failed to load");
    setLogoError(true);
  };

  if (logoError) {
    // Fallback to text if logo fails to load
    return (
      <span 
        className={`text-2xl font-bold ${className}`}
        style={{fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: "24px"}}
      >
        Gaapio
      </span>
    );
  }

  return (
    <div className={`logo ${className}`}>
      <img
        src={isDark ? darkModeLogo : lightModeLogo}
        alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
        width={140}
        height={32}
        className="h-8 w-auto max-w-[140px] object-contain"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
        onError={handleImageError}
      />
    </div>
  );
});
Logo.displayName = 'Logo';
