
import { Link } from "react-router-dom";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function ProductHighlightsSection() {
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

  const products = [
    {
      number: "01",
      title: "Generate Memos Fast",
      description: "AI-powered ASC 606 memos, leases, and more in seconds.",
      href: "/accounting-memos",
      delay: 0
    },
    {
      number: "02",
      title: "Auto-Draft Footnote Disclosures",
      description: "Create transparent, audit-ready disclosures instantly.",
      href: "/footnote-disclosures",
      delay: 200
    },
    {
      number: "03",
      title: "Stay Ahead of Guidance Updates",
      description: "Real-time alerts for GAAP/SEC changes and training.",
      href: "/guidance-updates",
      delay: 400
    }
  ];

  return (
    <section 
      id="product-highlights" 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]"
    >
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Three Ways to Transform Your Close</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From technical accounting to regulatory updates — we've got you covered.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.map((product, index) => (
            <Link 
              key={product.title} 
              to={product.href}
              className={cn(
                "bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/20 cursor-pointer group",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDelay: `${product.delay}ms`,
                transitionDuration: "1000ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#339CFF]/20 to-[#339CFF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative">
                  <span className="text-2xl font-bold text-[#339CFF]">{product.number}</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{product.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
