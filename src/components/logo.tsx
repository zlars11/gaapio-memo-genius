
import { useEffect, useState } from "react";

export function Logo({ className = "h-28 w-auto" }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize based on system/user preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    
    // Listen for changes in the color scheme
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches || document.documentElement.classList.contains("dark"));
    };
    
    darkModeQuery.addEventListener("change", handleChange);
    
    // Listen for changes to the dark class on the document
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    // Listen for storage events (for theme toggle)
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
      alt="Gaapio Logo" 
      width={600} 
      height={150} 
      className={className}
    />
  );
}
