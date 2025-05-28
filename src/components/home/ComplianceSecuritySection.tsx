
import { Shield, Lock, CheckCircle2 } from "lucide-react";
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

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]"
    >
      <ResponsiveContainer>
        <div className="text-center max-w-4xl mx-auto">
          <h2 
            className={cn(
              "text-3xl md:text-4xl font-bold mb-6 transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
          >
            🔒 Enterprise-Grade Security. 📘 Audit-Grade Accuracy.
          </h2>
          <p 
            className={cn(
              "text-xl mb-12 text-muted-foreground transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Built to protect your data and exceed auditor expectations — without compromise.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Shield,
                title: "Data Privacy",
                description: "Your information never trains public AI models. Private by design.",
                delay: 400
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-grade encryption, access controls, and compliance with modern security protocols.",
                delay: 600
              },
              {
                icon: CheckCircle2,
                title: "Audit-Ready Docs",
                description: "Structured documentation that meets Big 4-level expectations.",
                delay: 800
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={cn(
                  "text-center p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-1000",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-[30px]"
                )}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#339CFF]/20 to-[#339CFF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-[#339CFF]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
