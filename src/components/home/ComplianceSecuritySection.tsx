
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
      icon: Lock,
      title: "Data Privacy",
      description: "Your data never trains public AI. Private by design. End-to-end encrypted."
    },
    {
      icon: ShieldCheck,
      title: "Enterprise Security", 
      description: "Bank-grade encryption, SSO support, and role-based access at every layer."
    },
    {
      icon: FileCheck,
      title: "Audit-Ready Docs",
      description: "Structured output aligned with Big 4 documentation standards."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-gradient-to-br from-[#f9fbfd] via-white to-[#f0f6ff] dark:bg-gradient-to-br dark:from-[#0d1117] dark:via-[#161b22] dark:to-[#1c2128] overflow-hidden"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#339CFF] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-[#339CFF] rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-[#339CFF] rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main shield background illustration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative opacity-5 dark:opacity-10">
          <ShieldCheck className="h-96 w-96 text-[#339CFF] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-[#339CFF]/20 to-transparent rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Additional background security icons - same size and transparency as shield */}
      <div className="absolute top-20 left-20 opacity-5 dark:opacity-10 pointer-events-none">
        <Lock className="h-96 w-96 text-[#339CFF] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#339CFF]/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="absolute bottom-20 right-20 opacity-5 dark:opacity-10 pointer-events-none">
        <FileCheck className="h-96 w-96 text-[#339CFF] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#339CFF]/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <ResponsiveContainer>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Lead-in tagline */}
          <div 
            className={cn(
              "text-xs font-semibold tracking-[0.2em] uppercase text-[#339CFF] mb-4 transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[20px]"
            )}
          >
            Security-First AI for Finance Teams
          </div>

          {/* Headline */}
          <h2 
            className={cn(
              "text-3xl md:text-4xl lg:text-5xl font-bold mb-6 transition-all duration-1000 text-gray-900 dark:text-white",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            Enterprise-Grade Security You Can Trust
          </h2>

          {/* Subheadline */}
          <p 
            className={cn(
              "text-lg md:text-xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Protecting sensitive financial data with private-by-design AI, bank-level encryption, and granular access controls.
          </p>

          {/* Features stacked vertically */}
          <div className="space-y-12 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className={cn(
                  "text-center transition-all duration-1000",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-[40px]"
                )}
                style={{ transitionDelay: `${400 + index * 200}ms` }}
              >
                {/* Feature icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#339CFF] to-[#2B70F7] rounded-2xl flex items-center justify-center shadow-lg">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                {/* Feature content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
