
import { useEffect, useRef, useState } from "react";
import Typed from "typed.js";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const AnimatedDisclosure = () => {
  const { width } = useWindowSize();
  const disclosureContainerRef = useRef<HTMLDivElement>(null);
  const typedElementRef = useRef<HTMLDivElement>(null);
  const typedInstanceRef = useRef<Typed | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Adjust scale and positioning based on screen width for straight alignment
  const getScale = () => {
    if (width < 480) return 0.35;   // Mobile phones
    if (width < 768) return 0.5;    // Tablets
    if (width < 1024) return 0.6;   // Small laptops
    return 0.7;                     // Larger screens
  };

  // Position for the disclosure content area (right side of the interface)
  const getTopPosition = () => {
    if (width < 480) return "90px";  // Higher on mobile
    if (width < 768) return "120px";
    return "200px";
  };

  // Get container width for disclosure area
  const getContainerWidth = () => {
    if (width < 480) return "80%";
    if (width < 768) return "80%";
    return "80%";
  };

  // Position for disclosure content (right side)
  const getLeftPosition = () => {
    if (width < 480) return "48%";   // More to the right for disclosure area
    if (width < 768) return "48%";
    return "48%";
  };

  // Get container height for disclosure content
  const getContainerHeight = () => {
    if (width < 480) return "calc(180% - 150px)";
    if (width < 768) return "calc(160% - 150px)";
    return "calc(120% - 150px)";
  };

  // Apply theme styles directly using JavaScript
  const applyThemeStyles = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
    
    if (disclosureContainerRef.current) {
      disclosureContainerRef.current.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
      disclosureContainerRef.current.style.borderColor = isDarkMode ? "#333333" : "#e5e7eb";
      disclosureContainerRef.current.style.boxShadow = isDarkMode 
        ? "0 0 15px rgba(255,255,255,0.05)" 
        : "0 0 15px rgba(0,0,0,0.1)";
    }
  };

  useEffect(() => {
    // Apply theme once when component mounts
    applyThemeStyles();
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoaded(true);
      
      // Initialize typed.js with condensed ASC 842 footnote disclosure content
      if (typedElementRef.current) {
        typedInstanceRef.current = new Typed(typedElementRef.current, {
          strings: [
            '<p><strong>NOTE 1 - LEASES</strong></p>\n\n<p><strong>Lease Portfolio Overview</strong><br />The Company leases office facilities, equipment, and vehicles under operating and finance lease arrangements.</p>\n\n<p><strong>Right-of-Use Assets</strong><br />As of December 31, 2024:<br />• Office facilities: $8.2 million<br />• Equipment: $3.1 million<br />• Vehicles: $1.4 million<br />Total ROU assets: $12.7 million...</p>'
          ],
          typeSpeed: 0.5,
          backSpeed: 0,
          showCursor: true,
          cursorChar: '|',
          loop: false,
          contentType: 'html'
        });
      }
    }, 100);
    
    // Set up observer to watch for theme changes
    const observer = new MutationObserver(() => {
      applyThemeStyles();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    // Listen for storage events (for theme changes from other tabs)
    const handleStorageEvent = () => {
      applyThemeStyles();
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
      if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="disclosure-animation-container">
      <div 
        ref={disclosureContainerRef}
        className={`disclosure-card ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
          borderColor: isDark ? "#333333" : "#e5e7eb",
          boxShadow: isDark 
            ? "0 0 15px rgba(255,255,255,0.05)" 
            : "0 0 15px rgba(0,0,0,0.1)",
          maxWidth: "850px",
          width: "100%",
          transform: "rotate(0deg)" // Remove rotation for straight alignment
        }}
      >
        <img 
          src={isDark ? "/assets/images/app-disclosure-night.png" : "/assets/images/app-disclosure-day.png"}
          alt="Gaapio Footnote Disclosure UI" 
          className="disclosure-background-image"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain"
          }}
        />
        
        <div 
          className="disclosure-text-overlay"
          style={{
            position: "absolute",
            top: getTopPosition(),
            left: getLeftPosition(),
            right: "2.5%",
            textAlign: "left",
            lineHeight: "1.2",
            zIndex: 10,
            height: getContainerHeight(),
            display: "flex",
            alignItems: "flex-start",
            width: getContainerWidth()
          }}
        >
          <div 
            ref={typedElementRef}
            className="disclosure-text"
            style={{
              color: isDark ? '#FFFFFF' : '#333',
              backgroundColor: isDark ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              padding: '4px',
              borderRadius: '4px',
              width: '100%',
              fontSize: '12px',
              transform: `scale(${getScale()})`,
              transformOrigin: 'top left',
              whiteSpace: 'pre-wrap',
              maxHeight: `${100 / getScale()}%`,
              overflow: 'hidden'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
