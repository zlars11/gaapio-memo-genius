
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

  return (
    <picture>
      <source 
        srcSet="/lovable-uploads/313c4648-d406-46d1-a3f7-429f3a8ea0e4.png" 
        media="(prefers-color-scheme: dark)" 
        width={600} 
        height={150}
      />
      <source 
        srcSet="/lovable-uploads/ce4eb84f-1d6e-4138-98c9-0c8b95e6797b.png" 
        media="(prefers-color-scheme: light)" 
        width={600} 
        height={150}
      />
      <img 
        src={isDark ? "/lovable-uploads/313c4648-d406-46d1-a3f7-429f3a8ea0e4.png" : "/lovable-uploads/ce4eb84f-1d6e-4138-98c9-0c8b95e6797b.png"}
        alt="Gaapio Logo" 
        width={600} 
        height={150} 
        className={className}
      />
    </picture>
  );
}
