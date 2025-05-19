
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
    // Check if site is password protected
    const protectionEnabled = localStorage.getItem("password_protection_enabled");
    console.log("Password protection enabled:", protectionEnabled);
    
    if (protectionEnabled === "true") {
      setIsProtected(true);
      
      // Check if user has valid access
      const accessData = sessionStorage.getItem("site_access");
      if (accessData) {
        try {
          const { granted, expires, version } = JSON.parse(accessData);
          const currentVersion = localStorage.getItem("session_version") || "0";
          
          // Check if access is granted, not expired, and not invalidated by version change
          const isValid = granted && 
                          expires > Date.now() && 
                          version === currentVersion;
          
          console.log("Access check:", { 
            granted, 
            expires, 
            currentTime: Date.now(), 
            isExpired: expires <= Date.now(),
            version,
            currentVersion,
            isVersionMatch: version === currentVersion,
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
      setHasAccess(true);
    }
    
    setLoading(false);
  }, [location.pathname]); // Re-check on path change

  // Don't protect admin routes or if protection is not enabled
  if (
    loading ||
    location.pathname.startsWith("/admin") ||
    !isProtected ||
    hasAccess
  ) {
    return <>{children}</>;
  }

  // Otherwise, show password page
  return <PasswordProtectionPage />;
};

export default PasswordProtection;
