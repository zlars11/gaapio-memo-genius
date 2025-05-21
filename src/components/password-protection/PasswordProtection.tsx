
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PasswordProtectionPage from "./PasswordProtectionPage";
import { getProtectionStatus, hasValidAccess } from "@/utils/securityUtils";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(true); // Default to protected until we confirm otherwise
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      // Check if site is password protected - with a more reliable detection
      const protectionEnabled = getProtectionStatus();
      console.log("Password protection status:", protectionEnabled ? "Enabled" : "Disabled");
      
      setIsProtected(protectionEnabled);
      
      if (protectionEnabled) {
        // Check if user has valid access
        const accessValid = hasValidAccess();
        console.log("Access validation result:", accessValid ? "Valid" : "Invalid");
        setHasAccess(accessValid);
      } else {
        // If protection is disabled, grant access
        console.log("Site is not password protected");
        setHasAccess(true);
      }
      
      setLoading(false);
    };

    // Check access when component mounts or location changes
    checkAccess();
    
    // Set up a periodic check to validate access hasn't expired
    const intervalId = setInterval(checkAccess, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
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
