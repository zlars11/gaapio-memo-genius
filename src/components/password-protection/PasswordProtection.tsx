
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PasswordProtectionPage from "./PasswordProtectionPage";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = () => {
      // Check if site is password protected
      const protectionEnabled = localStorage.getItem("password_protection_enabled");
      console.log("Password protection status:", protectionEnabled === "true" ? "Enabled" : "Disabled");
      
      if (protectionEnabled === "true") {
        setIsProtected(true);
        
        // Check if user has valid access
        const accessData = sessionStorage.getItem("site_access");
        console.log("Access data from session:", accessData || "None");
        
        if (accessData) {
          try {
            const parsedData = JSON.parse(accessData);
            const { granted, expires, version } = parsedData;
            const currentVersion = localStorage.getItem("session_version") || "0";
            
            // Check if access is granted, not expired, and not invalidated by version change
            const currentTime = Date.now();
            const isExpired = expires <= currentTime;
            const isVersionMatch = version === currentVersion;
            
            const isValid = granted && !isExpired && isVersionMatch;
            
            console.log("Access validation:", { 
              granted, 
              expires, 
              currentTime,
              isExpired,
              version,
              currentVersion,
              isVersionMatch,
              isValid
            });
            
            setHasAccess(isValid);
          } catch (e) {
            console.error("Error parsing access data:", e);
            setHasAccess(false);
          }
        } else {
          console.log("No access data found in session storage");
          setHasAccess(false);
        }
      } else {
        console.log("Site is not password protected");
        setIsProtected(false);
        setHasAccess(true);
      }
      
      setLoading(false);
    };

    // Check access when component mounts or location changes
    checkAccess();
  }, [location.pathname]); // Re-check on path change

  // Determine if current path is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname === "/login";
  
  // Show loading state
  if (loading) {
    return <div className="hidden">Loading access control...</div>;
  }
  
  // Don't protect admin routes or if protection is not enabled
  if (isAdminRoute || !isProtected || hasAccess) {
    return <>{children}</>;
  }

  // Otherwise, show password page
  return <PasswordProtectionPage />;
};

export default PasswordProtection;
