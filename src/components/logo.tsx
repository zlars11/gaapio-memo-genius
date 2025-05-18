
import { useEffect, useState, memo } from "react";

// Ensures proper sizing, day/night mode support, optimized for header
export const Logo = memo(({ className = "" }: { className?: string }) => {
  const [isDark, setIsDark] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error("Error in Logo component:", error);
      // Continue with default false for isDark
    }
  }, []);

  // Logo files (white for dark, black for light)
  const darkModeLogo = "/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png";
  const lightModeLogo = "/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png";
  
  // Fallback logo (text-based)
  const renderFallbackLogo = () => (
    <div className={`flex items-center justify-center h-12 ${className}`}>
      <span className="text-2xl font-bold">Gaapio</span>
    </div>
  );

  if (imageError) {
    return renderFallbackLogo();
  }

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
      onError={() => {
        console.error("Failed to load logo image");
        setImageError(true);
      }}
    />
  );
});
Logo.displayName = 'Logo';
