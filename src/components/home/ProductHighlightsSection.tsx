import { Link } from "react-router-dom";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, FileCheck, Bell } from "lucide-react";

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
      label: "ACCOUNTING MEMOS",
      title: "Fast, Audit-ready Technical Memos",
      bulletPoints: [
        "Version history, internal reviews, and audit package",
        "Drafted in seconds with trained AI",
        "Contract Analysis"
      ],
      href: "/accounting-memos",
      delay: 0,
      icon: FileText,
      iconColor: "#B0B0B0"
    },
    {
      label: "FOOTNOTE DISCLOSURES",
      title: "Benchmark & Auto-Draft Footnote Disclosures",
      bulletPoints: [
        "AI trained benchmarking",
        "Footnote requirement checklists",
        "CPA approved, industry leading formatting"
      ],
      href: "/footnote-disclosures",
      delay: 200,
      icon: FileCheck,
      iconColor: "#B0B0B0"
    },
    {
      label: "GAAP/SEC UPDATES",
      title: "Stay Ahead of Guidance Updates",
      bulletPoints: [
        "Instant alerts for new standards",
        "Actionable implementation guidance",
        "Ongoing training to stay current"
      ],
      href: "/guidance-updates",
      delay: 400,
      icon: Bell,
      iconColor: "#339CFF"
    }
  ];

  return (
    <section 
      id="product-highlights" 
      ref={sectionRef}
      className="py-20 md:py-32 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B] relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#339CFF]/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-[#339CFF]/5 rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#339CFF]/10 rounded-full blur-lg"></div>
      </div>

      <ResponsiveContainer>
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gaapio's Core Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built to streamline your close — from memos to disclosures to guidance compliance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto relative">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <Link
                key={product.title} 
                to={product.href}
                className={cn(
                  "bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 group relative overflow-hidden z-10 block",
                  "hover:shadow-[0_8px_25px_rgba(51,156,255,0.15)] hover:scale-[1.02] hover:border-[#339CFF]/30",
                  "hover:-translate-y-1",
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
                {/* Large background number - repositioned to avoid overlap with titles */}
                <div className="absolute top-8 right-4 text-[120px] font-bold opacity-[0.08] text-[#339CFF] dark:text-white/20 leading-none">
                  {product.number}
                </div>

                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Pillar Label */}
                  <div className="mb-4">
                    <span className="text-sm font-bold text-[#339CFF] tracking-wider">
                      {product.label}
                    </span>
                  </div>

                  {/* Enhanced icon with background */}
                  <div className="relative mb-6">
                    <div 
                      className="w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${product.iconColor}20, ${product.iconColor}10)`
                      }}
                    >
                      {/* Subtle inner glow */}
                      <div 
                        className="absolute inset-1 rounded-xl"
                        style={{
                          background: `linear-gradient(135deg, ${product.iconColor}10, transparent)`
                        }}
                      ></div>
                      <IconComponent 
                        className="w-8 h-8 relative z-10" 
                        style={{ color: product.iconColor }}
                      />
                    </div>
                    {/* Floating accent */}
                    <div 
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full group-hover:scale-125 transition-transform duration-300"
                      style={{ backgroundColor: `${product.iconColor}20` }}
                    ></div>
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white group-hover:text-[#339CFF] transition-colors duration-300">
                    {product.title}
                  </h3>

                  {/* Bullet points */}
                  <ul className="text-left text-sm space-y-2 w-full">
                    {product.bulletPoints.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#339CFF] mt-2 mr-3 group-hover:scale-125 transition-transform duration-300"></div>
                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Subtle call-to-action indicator */}
                  <div className="mt-6 text-[#339CFF] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More →
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#339CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              </Link>
            );
          })}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
