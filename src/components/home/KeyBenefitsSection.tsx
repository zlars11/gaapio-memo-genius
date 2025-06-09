
import { Clock, FileCheck, BadgeCheck, BookCheck, Shield, Users } from "lucide-react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      icon: FileCheck,
      title: "Audit-Ready Docs",
      description: "Structured documentation that satisfies auditor requirements",
      delay: 200
    },
    {
      icon: BadgeCheck,
      title: "CPA-Level Accuracy",
      description: "AI-generated output that matches experienced CPA quality",
      delay: 400
    },
    {
      icon: BookCheck,
      title: "GAAP Compliance",
      description: "Always up-to-date with the latest accounting standards",
      delay: 600
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Your data stays private with strict security protocols",
      delay: 800
    },
    {
      icon: Users,
      title: "Trusted Team",
      description: "Team of CPAs that speaks your language",
      delay: 1000
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className={cn(
                "text-center p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-500 h-full flex flex-col min-h-[280px]",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDelay: `${benefit.delay}ms`,
              }}
            >
              <div className="flex justify-center mb-6">
                <benefit.icon className="h-8 w-8 text-[#2B70F7]" />
              </div>
              <h3 className="text-lg font-bold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <div className="text-center">
          <div 
            className={cn(
              "transition-all duration-1000",
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-[30px]"
            )}
            style={{ transitionDelay: "1200ms" }}
          >
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/faq?open=chatgpt">How is this different than ChatGPT?</Link>
            </Button>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
