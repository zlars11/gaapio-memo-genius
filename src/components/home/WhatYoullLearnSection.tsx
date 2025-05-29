
import { FileText, BookOpen, Bell } from "lucide-react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function WhatYoullLearnSection() {
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

  const features = [
    {
      icon: FileText,
      title: "Technical Accounting Memos",
      description: "Practical guidance on ASC 606, leases, and complex transactions with built-in CPA-style audit trail and documentation."
    },
    {
      icon: BookOpen,
      title: "Review-Ready Disclosures",
      description: "Comprehensive footnote disclosures that are transparent, audit-ready, and formatted for immediate review."
    },
    {
      icon: Bell,
      title: "GAAP/SEC Standard Updates",
      description: "Real-time alerts and insights on new accounting standard changes with practical implementation guidance."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]"
    >
      <ResponsiveContainer>
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div>
            <h2 
              className={cn(
                "text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
            >
              What You'll Get with Gaapio
            </h2>
            <p 
              className={cn(
                "text-xl text-muted-foreground mb-12 transition-all duration-1000",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ transitionDelay: "200ms" }}
            >
              Everything you need to streamline your accounting documentation process.
            </p>
            
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className={cn(
                    "flex gap-4 transition-all duration-1000",
                    isVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-[30px]"
                  )}
                  style={{ transitionDelay: `${400 + index * 200}ms` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#339CFF]/20 to-[#339CFF]/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-[#339CFF]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Professional Image */}
          <div 
            className={cn(
              "relative transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="aspect-video bg-gradient-to-br from-[#339CFF]/10 to-[#339CFF]/5 rounded-xl border border-[#339CFF]/20 overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Modern laptop displaying financial accounting dashboard with charts and data analysis in a bright, professional workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#339CFF]/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
