
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
      icon: BookCheck,
      title: "Organized and Trusted",
      description: "At Gaapio, we’ve organized the process from start to finish in a logical, easy-to-follow format. Everything you need is in one place — no more digging through scattered files or outdated resources. Built by a team of CPAs who have been in your shoes, Gaapio is designed to make your work more efficient, accurate, and professional. Our goal is simple: to give you a tool that not only saves time but also helps you deliver polished results that make you look great.",
      delay: 0
    },
    {
      icon: FileCheck,
      title: "Audit Ready",
      description: "With Gaapio, audit preparation is seamless. Every input, version history, analysis, and comment is automatically captured, giving you a complete record of the decision-making process. With audit view and a robust audit export, you can provide auditors with clear documentation in minutes. Internal reviews and sign-offs are tracked within the platform, ensuring a verifiable trail of oversight and approvals. The result is documentation that stands up to scrutiny and gives your team confidence going into the audit.",
      delay: 200
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your data is always secure, period. Nothing you upload is ever used to train models or made public — it stays private to your organization. We’ve built our platform with strict access controls, encryption, and a security-first mindset so you can trust that sensitive financial information is fully protected. In addition, we are pursuing SOC 2 certification to provide independent assurance that our security practices meet the highest industry standards. With Gaapio, you can confidently adopt AI without ever compromising on data privacy or compliance.",
      delay: 400
    },
    {
      icon: BadgeCheck,
      title: "Highly Trained Models",
      description: "Our models aren’t just “off-the-shelf” AI — they’re tailored for technical accounting. By feeding in far more structured information than typical tools like ChatGPT or Gemini, and by meticulously iterating on prompts, inputs, and workflows, we’ve dialed in our models to deliver precise, reliable, and highly relevant outputs. Every refinement we’ve made is focused on one thing: giving you answers that feel like they were written by an experienced CPA. The result is a solution that consistently produces polished, professional documentation you can trust.",
      delay: 600
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title}
              className={cn(
                "p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col min-h-[320px]",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDelay: `${benefit.delay}ms`,
              }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#339CFF]/20 to-[#339CFF]/10 rounded-xl flex items-center justify-center mr-4">
                  <benefit.icon className="h-6 w-6 text-[#339CFF]" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-left">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow text-left text-base">{benefit.description}</p>
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
