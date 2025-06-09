
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [enableSelfSignup, setEnableSelfSignup] = useState(true);

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

    // Load self-signup setting
    const savedSetting = localStorage.getItem("enableSelfSignup");
    setEnableSelfSignup(savedSetting !== null ? savedSetting === "true" : true);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background/95 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      <ResponsiveContainer>
        <div className="text-center relative z-10">
          <div 
            className={`transition-all duration-1000 ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Close?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Join the CPAs who are already saving hours every month with AI-powered accounting documentation.
            </p>
          </div>

          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-200 ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            {enableSelfSignup ? (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-4 h-auto">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <Link to="/contact">Ask a Question</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="text-lg px-8 py-4 h-auto">
                  <Link to="/contact">Ask a Question</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <Link to="/request-demo">Request Demo</Link>
                </Button>
              </>
            )}
          </div>

          <div 
            className={`mt-8 text-sm text-muted-foreground transition-all duration-1000 delay-400 ${
              isVisible 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-8"
            }`}
          >
            No credit card required • Setup in minutes • Cancel anytime
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
