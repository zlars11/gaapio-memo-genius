
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function TrustBarSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const companies = [
    "DataStream", "CloudCore", "NexusBooks", "TechFinance", 
    "AccountPro", "FiscalEdge", "FinSync", "AccuLedger"
  ];

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
            {companies.map((company, index) => (
              <div 
                key={company}
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
                  <div className="w-32 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                    <span className="font-semibold text-gray-600 dark:text-gray-300 text-sm">
                      {company}
                    </span>
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
