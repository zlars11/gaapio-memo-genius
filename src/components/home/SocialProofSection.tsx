
import React, { useState, useEffect } from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(true);

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

  if (!isVisible) {
    return null;
  }

  // Updated companies with made-up names
  const companies = [
    { id: 1, name: "FinSync", logo: "finsync" },
    { id: 2, name: "AccuLedger", logo: "acculedger" },
    { id: 3, name: "DataStream", logo: "datastream" },
    { id: 4, name: "CloudCore", logo: "cloudcore" },
    { id: 5, name: "NexusBooks", logo: "nexusbooks" },
  ];

  return (
    <section 
      id="social-proof" 
      className="py-12 md:py-16 bg-background border-t border-border/20"
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
        
        <div className="flex justify-center items-center space-x-8 md:space-x-12">
          {companies.map((company) => (
            <div 
              key={company.id}
              className="w-20 h-12 md:w-28 md:h-16 flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity"
              aria-label={`${company.name} logo`}
            >
              <div className="w-full h-full bg-muted/50 rounded flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-sm">
                  {company.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
