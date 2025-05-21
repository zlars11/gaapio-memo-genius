import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PasswordProtectionPage from "./PasswordProtectionPage";
import { getProtectionStatus, hasValidAccess } from "@/utils/securityUtils";

interface PasswordProtectionProps {
  children: React.ReactNode;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isProtected, setIsProtected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      // Check if site is password protected
      const protectionEnabled = getProtectionStatus();
      console.log("Password protection status:", protectionEnabled ? "Enabled" : "Disabled");
      
      if (protectionEnabled) {
        setIsProtected(true);
        
        // Check if user has valid access
        const accessValid = hasValidAccess();
        console.log("Access validation result:", accessValid ? "Valid" : "Invalid");
        setHasAccess(accessValid);
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
