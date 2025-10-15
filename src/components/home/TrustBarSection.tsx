
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useActiveCustomerLogos } from "@/hooks/useCustomerLogos";

export function TrustBarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: logos, isLoading } = useActiveCustomerLogos();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Don't render if no logos or still loading
  if (isLoading || !logos || logos.length === 0) {
    return null;
  }

  return (
    <section 
      ref={sectionRef}
      className="py-16 bg-white dark:bg-background border-t border-gray-100 dark:border-gray-800"
    >
      <ResponsiveContainer>
        <div className="text-center mb-12">
          <h3 className="text-lg font-medium text-muted-foreground mb-8">
            Trusted by Leading Organizations
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {logos.map((logo, index) => (
              <div 
                key={logo.id}
                className={cn(
                  "flex items-center justify-center p-4 transition-all duration-1000",
                  isVisible 
                    ? "opacity-70 translate-y-0" 
                    : "opacity-0 translate-y-[20px]"
                )}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="text-center">
                  <div className="w-32 h-16 bg-muted/50 rounded-lg border border-border flex items-center justify-center hover:scale-105 transition-transform duration-300 p-2">
                    <img
                      src={logo.logo_url}
                      alt={logo.company_name}
                      className="max-w-full max-h-full object-contain"
                      title={logo.company_name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
