
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
    
    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
    };
  }, []);

  // Use the black logo for light mode and white for dark mode
  const darkModeLogo = "/lovable-uploads/313c4648-d406-46d1-a3f7-429f3a8ea0e4.png"; // White logo
  const lightModeLogo = "/lovable-uploads/ce5a7511-e788-4d8e-9592-8f6fffc2698f.png"; // Black logo

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
