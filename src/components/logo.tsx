
import { useEffect, useState, memo } from "react";

// Import the logo files directly
import darkLogo from "/public/assets/images/logo-dark.png";
import lightLogo from "/public/assets/images/logo-light.png";

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

  const handleImageError = () => {
    console.error("Logo image failed to load");
    setLogoError(true);
  };

  if (logoError) {
    // Fallback to text if logo fails to load
    return (
      <span 
        className={`text-2xl font-bold ${className}`}
        style={{fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif"}}
      >
        Gaapio
      </span>
    );
  }

  return (
    <div className={`logo-container ${className}`}>
      <img
        src={isDark ? darkLogo : lightLogo}
        alt="Gaapio Logo - AI-Powered Accounting Memo Platform"
        className="logo-image"
        style={{
          height: '48px',
          width: 'auto',
          maxHeight: 'none',
          maxWidth: 'none'
        }}
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

