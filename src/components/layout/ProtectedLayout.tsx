
import { ReactNode, useEffect, useState } from "react";
import { PasswordProtection } from "@/components/password-protection/PasswordProtection";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isReady, setIsReady] = useState(false);
  
  // Wait for hydration to complete before rendering protection logic
  useEffect(() => {
    // Using requestAnimationFrame ensures the DOM is fully loaded
    // before we attempt to render the protection logic
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);
  
  // During initial render, show nothing to prevent flashing content
  if (!isReady) {
    return null;
  }
  
  return <PasswordProtection>{children}</PasswordProtection>;
}
