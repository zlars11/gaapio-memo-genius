
import { ReactNode } from "react";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // No longer using password protection - just render children directly
  return <>{children}</>;
}
