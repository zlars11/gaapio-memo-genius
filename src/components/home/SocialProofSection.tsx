
import React, { useState, useEffect, useRef } from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check feature toggle setting
    const savedToggles = localStorage.getItem("featureToggles");
    if (savedToggles) {
      const toggles = JSON.parse(savedToggles);
      const footerLogosToggle = toggles.find((toggle: any) => toggle.id === "footer-logos");
      if (footerLogosToggle) {
        setIsVisible(footerLogosToggle.enabled);
      }
    }
  }, []);

  // Company logos replaced with brand colors
  const companies = [
    { id: 1, name: "Sky Blue", color: "text-blue-500" },
    { id: 2, name: "Emerald", color: "text-green-500" },
    { id: 3, name: "Indigo", color: "text-indigo-500" },
    { id: 4, name: "Violet", color: "text-purple-500" },
    { id: 5, name: "Ruby", color: "text-red-500" },
    { id: 6, name: "Amber", color: "text-amber-500" },
    { id: 7, name: "Teal", color: "text-teal-500" },
    { id: 8, name: "Cyan", color: "text-cyan-500" },
  ];

  // Double the array for seamless scrolling
  const doubledCompanies = [...companies, ...companies];

  if (!isVisible) {
    return null;
  }

  return (
    <section 
      id="social-proof" 
      className="py-12 md:py-16 bg-background border-t border-border/20 overflow-hidden"
      aria-labelledby="social-proof-heading"
    >
      <ResponsiveContainer>
        <div className="text-center mb-8">
          <h2 
            id="social-proof-heading" 
            className="text-2xl md:text-3xl font-bold mb-2"
          >
            Trusted by Public and Private Companies
          </h2>
          <p className="text-muted-foreground">
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
                  className="w-32 h-16 md:w-40 md:h-20 flex items-center justify-center transition-transform hover:scale-105"
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
          <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-background to-transparent"></div>
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
