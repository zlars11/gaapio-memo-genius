
import { FileSearch, FileCheck, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function HowItWorksSection() {
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
      { threshold: 0.6 } // Trigger when 60% of section is visible
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
      id="how-it-works" 
      ref={sectionRef}
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B] dark:text-white"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-[#f0f0f0]">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
            Streamline your technical accounting memos in three powerful steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1 */}
          <div 
            className={cn(
              "flex flex-col bg-white dark:bg-[#1a2234] rounded-2xl p-8 relative overflow-hidden transition-all",
              "hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_16px_rgba(255,255,255,0.05)] hover:translate-y-[-4px]",
              "shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.03)]",
              "dark:border dark:border-white/5",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            )}
            style={{ 
              transitionDelay: "0ms",
              transitionDuration: "2000ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          >
            <div className="absolute right-6 top-4 text-[100px] font-bold opacity-10 text-[#339CFF] dark:text-[rgba(255,255,255,0.05)] dark:opacity-100">
              01
            </div>
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#339CFF20] mb-6 transition-transform duration-300 hover:scale-105 dark:bg-[#339CFF10]">
              <FileSearch className="h-8 w-8 text-[#339CFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 relative z-10 dark:text-[#e5e5e5]">Draft</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Guided prompts create built-in guardrails for accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Up-to-date with latest standards</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Drafted instantly by trained AI</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Contract analysis and document upload</span>
              </li>
            </ul>
          </div>
          
          {/* Step 2 */}
          <div 
            className={cn(
              "flex flex-col bg-white dark:bg-[#1a2234] rounded-2xl p-8 relative overflow-hidden transition-all",
              "hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_16px_rgba(255,255,255,0.05)] hover:translate-y-[-4px]",
              "shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.03)]",
              "dark:border dark:border-white/5",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            )}
            style={{ 
              transitionDelay: "600ms",
              transitionDuration: "2000ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          >
            <div className="absolute right-6 top-4 text-[100px] font-bold opacity-10 text-[#339CFF] dark:text-[rgba(255,255,255,0.05)] dark:opacity-100">
              02
            </div>
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#339CFF20] mb-6 transition-transform duration-300 hover:scale-105 dark:bg-[#339CFF10]">
              <FileCheck className="h-8 w-8 text-[#339CFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 relative z-10 dark:text-[#e5e5e5]">Review</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Proprietary AI reviews and gives suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>One-click edits and enhancements</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Internal sign offs and audit trail</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Full version history and reviewer comments</span>
              </li>
            </ul>
          </div>
          
          {/* Step 3 */}
          <div 
            className={cn(
              "flex flex-col bg-white dark:bg-[#1a2234] rounded-2xl p-8 relative overflow-hidden transition-all",
              "hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_6px_16px_rgba(255,255,255,0.05)] hover:translate-y-[-4px]",
              "shadow-[0_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.03)]",
              "dark:border dark:border-white/5",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            )}
            style={{ 
              transitionDelay: "1200ms",
              transitionDuration: "2000ms",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
            }}
          >
            <div className="absolute right-6 top-4 text-[100px] font-bold opacity-10 text-[#339CFF] dark:text-[rgba(255,255,255,0.05)] dark:opacity-100">
              03
            </div>
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#339CFF20] mb-6 transition-transform duration-300 hover:scale-105 dark:bg-[#339CFF10]">
              <Download className="h-8 w-8 text-[#339CFF]" />
            </div>
            <h3 className="text-xl font-semibold mb-4 relative z-10 dark:text-[#e5e5e5]">Deliver</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2 dark:text-gray-400">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Presentation-ready memos</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Exportable audit package</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#339CFF] mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Organized file cabinet for final versions and AI training</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
