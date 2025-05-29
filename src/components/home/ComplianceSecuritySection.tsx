
import { ShieldCheck, Lock, FileCheck } from "lucide-react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ComplianceSecuritySection() {
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
      { threshold: 0.4 }
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
      icon: ShieldCheck,
      title: "Data Privacy",
      description: "Your information never trains public AI models. Private by design."
    },
    {
      icon: Lock,
      title: "Enterprise Security", 
      description: "Bank-grade encryption, access controls, and modern security protocols."
    },
    {
      icon: FileCheck,
      title: "Audit-Ready Docs",
      description: "Structured documentation that meets Big 4-level expectations."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-[#f9fbfd] dark:bg-background"
    >
      <ResponsiveContainer>
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <h2 
              className={cn(
                "text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
            >
              Enterprise-Grade Security You Can Trust
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
              Designed to protect sensitive financial data with bank-grade encryption, private AI architecture, and robust access controls.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={feature.title}
                  className={cn(
                    "flex items-start gap-4 transition-all duration-1000",
                    isVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-[30px]"
                  )}
                  style={{ transitionDelay: `${400 + index * 200}ms` }}
                >
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-[#2B70F7]" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Security Visual */}
          <div 
            className={cn(
              "relative flex justify-center lg:justify-end transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="relative">
              {/* Floating shield background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#2B70F7]/10 to-[#2B70F7]/5 rounded-full blur-3xl scale-150"></div>
              
              {/* Main shield icon */}
              <div className="relative bg-gradient-to-br from-[#2B70F7]/20 to-[#2B70F7]/10 rounded-2xl p-16 border border-[#2B70F7]/20">
                <ShieldCheck className="h-24 w-24 text-[#2B70F7] mx-auto" />
                
                {/* Floating security badges */}
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <Lock className="h-6 w-6 text-[#2B70F7]" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                  <FileCheck className="h-6 w-6 text-[#2B70F7]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
