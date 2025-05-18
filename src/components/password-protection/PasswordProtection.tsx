
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
    try {
      // Check if site is password protected
      const protectionEnabled = localStorage.getItem("password_protection_enabled");
      
      if (protectionEnabled === "true") {
        setIsProtected(true);
        
        // Check if user has valid access
        const accessData = sessionStorage.getItem("site_access");
        if (accessData) {
          try {
            const { granted, expires, version } = JSON.parse(accessData);
            const currentVersion = localStorage.getItem("session_version") || "0";
            
            // Check if access is granted, not expired, and not invalidated by version change
            if (granted && expires > Date.now() && version === currentVersion) {
              setHasAccess(true);
            }
          } catch (e) {
            console.error("Error parsing access data:", e);
            // If there's an error parsing, default to no access
            setHasAccess(false);
          }
        }
      } else {
        // If protection is not enabled, grant access
        setHasAccess(true);
      }
    } catch (error) {
      // If there's any error in the protection check, default to allowing access
      console.error("Error in password protection check:", error);
      setHasAccess(true);
    } finally {
      setLoading(false);
    }
  }, []);

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
