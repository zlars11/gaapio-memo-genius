
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
      className="py-20 md:py-32 bg-slate-700 text-white"
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
            Enterprise-Grade Security. Audit-Grade Accuracy.
          </h2>
          <p 
            className={cn(
              "text-xl mb-12 text-white/90 transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Your data stays private. Your output stands up to Big 4 scrutiny.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: Shield,
                title: "Data Privacy",
                description: "Your information never trains public AI models",
                delay: 400
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                description: "Bank-level encryption and security protocols",
                delay: 600
              },
              {
                icon: CheckCircle2,
                title: "Audit Ready",
                description: "Documentation that satisfies auditor requirements",
                delay: 800
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={cn(
                  "text-center transition-all duration-1000",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-[30px]"
                )}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
