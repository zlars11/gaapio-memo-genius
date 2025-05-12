
import { FileText, Shield, CheckCircle2, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function BenefitsSection() {
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
      { threshold: 0.5 } // Increased threshold to 0.5 (50% visibility)
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
      icon: CheckCircle2,
      title: "Audit Ready",
      description: "Structured documentation that satisfies auditor requirements including version history and review notes.",
      delay: 0
    },
    {
      icon: Clock,
      title: "Time & Cost Savings",
      description: "Cut memo and disclosure creation time by up to 90%. Make your internal team look like rockstars — or save thousands compared to outsourced memos.",
      delay: 300
    },
    {
      icon: FileText,
      title: "CPA-Level Output",
      description: "AI-generated memos and disclosures that match or exceed the quality of experienced CPAs.",
      delay: 600
    },
    {
      icon: Shield,
      title: "GAAP/IFRS Compliance",
      description: "Always up-to-date with the latest accounting standards and guidelines.",
      delay: 900
    },
    {
      icon: ShieldCheck,
      title: "Enterprise-Grade Security",
      description: "Your data stays private — never used to train public AI models. We follow strict security protocols.",
      delay: 1200
    }
  ];

  return (
    <section 
      id="benefits" 
      ref={sectionRef}
      className="py-20 md:py-32 relative"
      style={{
        background: "var(--benefits-bg)",
        color: "var(--benefits-text)"
      }}
    >
      <style>
        {`
          :root {
            --benefits-bg: #f4faff;
            --benefits-text: inherit;
            --benefits-divider: #e0e0e0;
          }
          
          .dark {
            --benefits-bg: #111927;
            --benefits-text: #ffffff;
            --benefits-divider: #2a2f36;
          }
        `}
      </style>
      
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-12 md:gap-8 lg:gap-16 items-start">
          {/* Left column - Heading and description (40% width) */}
          <div className="md:col-span-4 space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
              <p className="text-xl text-muted-foreground max-w-md">
                Our trained AI platform will give you confidence in your approach while saving time and money.
              </p>
            </div>
            
            <div className="pt-4">
              <Button variant="link" className="group text-[#339CFF] p-0 h-auto font-medium">
                <div className="flex items-center cursor-pointer">
                  See Features 
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Button>
            </div>
          </div>
          
          {/* Vertical Divider (visible on md screens and up) */}
          <div className="hidden md:block absolute left-[40%] top-20 bottom-20">
            <Separator orientation="vertical" className="h-full" style={{ backgroundColor: "var(--benefits-divider)" }} />
          </div>
          
          {/* Right column - Benefits list (60% width) */}
          <div className="md:col-span-6 space-y-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={cn(
                  "flex gap-5 transition-all duration-700 ease-out",
                  isVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-5"
                )}
                style={{ 
                  transitionDelay: `${benefit.delay}ms`,
                  transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)"
                }}
              >
                <div className="mt-1 text-[#339CFF] flex-shrink-0">
                  <benefit.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
