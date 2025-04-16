
import React from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export function SocialProofSection() {
  // Array of company placeholder data
  const companies = [
    { id: 1, name: "TechCorp", logo: "tech-placeholder" },
    { id: 2, name: "Finance Plus", logo: "finance-placeholder" },
    { id: 3, name: "Global Enterprises", logo: "global-placeholder" },
    { id: 4, name: "Innovate Inc", logo: "innovate-placeholder" },
    { id: 5, name: "Momentum Partners", logo: "momentum-placeholder" },
    { id: 6, name: "Strategic Solutions", logo: "strategic-placeholder" },
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
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-5xl mx-auto">
          {companies.map((company) => (
            <div 
              key={company.id}
              className="w-28 h-12 md:w-32 md:h-16 flex items-center justify-center grayscale opacity-70 hover:opacity-100 transition-opacity"
              aria-label={`${company.name} logo`}
            >
              {/* Placeholder for company logo */}
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
