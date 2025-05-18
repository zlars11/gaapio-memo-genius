
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PasswordProtectionPage from "./PasswordProtectionPage";
import { toast } from "@/components/ui/use-toast";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Add console log to debug component initialization
    console.log("PasswordProtection component initializing...");

    const safeLocalStorageGet = (key: string, defaultValue: string): string => {
      try {
        const value = localStorage.getItem(key);
        return value !== null ? value : defaultValue;
      } catch (error) {
        console.error(`Error accessing localStorage for key "${key}":`, error);
        return defaultValue;
      }
    };

    const safeSessionStorageGet = (key: string): string | null => {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.error(`Error accessing sessionStorage for key "${key}":`, error);
        return null;
      }
    };

    try {
      // Check if site is password protected
      const protectionEnabled = safeLocalStorageGet("password_protection_enabled", "false");
      console.log("Password protection enabled:", protectionEnabled);
      
      if (protectionEnabled === "true") {
        setIsProtected(true);
        
        // Check if user has valid access
        const accessData = safeSessionStorageGet("site_access");
        if (accessData) {
          try {
            const { granted, expires, version } = JSON.parse(accessData);
            const currentVersion = safeLocalStorageGet("session_version", "0");
            
            // Check if access is granted, not expired, and not invalidated by version change
            if (granted && expires > Date.now() && version === currentVersion) {
              console.log("User has valid access");
              setHasAccess(true);
            } else {
              console.log("Access verification failed:", { granted, expires, expiresDate: new Date(expires), now: Date.now(), version, currentVersion });
            }
          } catch (e) {
            console.error("Error parsing access data:", e);
            // If there's an error parsing, default to no access
            setHasAccess(false);
          }
        } else {
          console.log("No access data found in session storage");
        }
      } else {
        // If protection is not enabled, grant access
        console.log("Password protection is disabled, granting access");
        setHasAccess(true);
      }
    } catch (error) {
      // If there's any error in the protection check, default to allowing access
      console.error("Error in password protection check:", error);
      setInitError(error instanceof Error ? error : new Error(String(error)));
      
      // Show a toast with the error
      toast({
        title: "Access Error",
        description: "There was a problem checking site protection. Access granted by default.",
        variant: "destructive",
      });
      
      setHasAccess(true);
    } finally {
      console.log("Password protection initialization complete");
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
    if (initError) {
      console.warn("Password protection initialized with error:", initError);
    }
    
    return <>{children}</>;
  }

  // Otherwise, show password page
  return <PasswordProtectionPage />;
};

export default PasswordProtection;
