
import React from "react";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = "" }: ResponsiveContainerProps) {
  return (
    <div className={`container px-4 md:px-6 mx-auto ${className}`}>
      {children}
    </div>
  );
}
