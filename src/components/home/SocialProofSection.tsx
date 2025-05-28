
import React, { useState, useEffect, useRef } from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { cn } from "@/lib/utils";

export function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
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

  // Company logos with website brand colors - adjusted with more blues
  const companies = [
    { id: 1, name: "DataStream", color: "text-blue-500" },
    { id: 2, name: "CloudCore", color: "text-muted-foreground" },
    { id: 3, name: "NexusBooks", color: "text-blue-700" },
    { id: 4, name: "TechFinance", color: "text-card-foreground" },
    { id: 5, name: "AccountPro", color: "text-[#339CFF]" },
    { id: 6, name: "FiscalEdge", color: "text-blue-400" },
    { id: 7, name: "FinSync", color: "text-foreground" },
    { id: 8, name: "AccuLedger", color: "text-primary" },
  ];

  // Double the array for seamless scrolling
  const doubledCompanies = [...companies, ...companies];

  return (
    <section 
      ref={sectionRef}
      id="social-proof" 
      className="py-12 md:py-16 border-t border-border/20 overflow-hidden"
      aria-labelledby="social-proof-heading"
    >
      <ResponsiveContainer>
        <div className="text-center mb-8">
          <h2 
            id="social-proof-heading" 
            className={cn(
              "text-2xl md:text-3xl font-bold mb-2 transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
          >
            Trusted by Public and Private Companies
          </h2>
          <p 
            className={cn(
              "text-muted-foreground transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Leading organizations rely on Gaapio for their accounting documentation needs
          </p>
        </div>
        
        <div className="relative w-full">
          <div 
            ref={scrollRef}
            className="flex space-x-8 whitespace-nowrap py-4 overflow-hidden"
          >
            <div className="animate-marquee flex space-x-8">
              {doubledCompanies.map((company, index) => (
                <div 
                  key={`${company.id}-${index}`}
                  className={cn(
                    "w-32 h-16 md:w-40 md:h-20 flex items-center justify-center transition-all duration-1000 hover:scale-105",
                    isVisible 
                      ? "opacity-70 translate-y-0" 
                      : "opacity-0 translate-y-[20px]"
                  )}
                  style={{ 
                    transitionDelay: `${index * 50}ms`,
                  }}
                  aria-label={`${company.name} logo`}
                >
                  <div className="w-full h-full bg-card rounded flex items-center justify-center p-3 shadow-sm border border-border/10">
                    <span className={`font-bold text-lg ${company.color}`}>
                      {company.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add gradient overlays for a fade effect */}
          <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-transparent to-transparent"></div>
        </div>
      </ResponsiveContainer>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-50% - 1rem));
            }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `
      }} />
    </section>
  );
}
