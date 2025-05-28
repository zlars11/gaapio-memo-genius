
import { Clock, CheckCircle2, Bot, BookOpen, Lock } from "lucide-react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function KeyBenefitsSection() {
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

  const benefits = [
    {
      icon: Clock,
      title: "Save 90% Time",
      description: "Cut memo and disclosure creation time from hours to minutes",
      delay: 0
    },
    {
      icon: CheckCircle2,
      title: "Audit-Ready Docs",
      description: "Structured documentation that satisfies auditor requirements",
      delay: 200
    },
    {
      icon: Bot,
      title: "CPA-Level Accuracy",
      description: "AI-generated output that matches experienced CPA quality",
      delay: 400
    },
    {
      icon: BookOpen,
      title: "GAAP/IFRS Compliance",
      description: "Always up-to-date with the latest accounting standards",
      delay: 600
    },
    {
      icon: Lock,
      title: "Enterprise-Grade Security",
      description: "Your data stays private with strict security protocols",
      delay: 800
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-white dark:bg-background"
    >
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Gaapio?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See why accounting teams are making the switch to AI-powered documentation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className={cn(
                "flex items-start gap-4 p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-500",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDelay: `${benefit.delay}ms`,
              }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#339CFF]/20 to-[#339CFF]/10 rounded-lg flex items-center justify-center">
                <benefit.icon className="h-6 w-6 text-[#339CFF]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
