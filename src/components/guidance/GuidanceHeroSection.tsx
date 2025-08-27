
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Bell, Calendar, FileText } from "lucide-react";

interface GuidanceHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const GuidanceHeroSection = memo(function GuidanceHeroSection({ 
  title = "Stay Current with Guidance Updates",
  subtitle = "AI-Powered. Always Updated."
}: GuidanceHeroSectionProps) {
  
  return (
    <section className="relative min-h-[100vh] md:min-h-[85vh] flex flex-col justify-center items-center pt-32 pb-20 md:pb-12 bg-white dark:bg-background overflow-hidden">
      <div className="container px-4 md:px-6 text-center relative z-10">
        
        {/* Text content centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">Request a Demo</Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
        
        {/* Larger static mockup card centered */}
        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-8 max-w-lg w-full hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">New Guidance Alert</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">ASC 842 Update — Leases</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                FASB clarifies embedded lease treatment in service arrangements.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Effective for FYs after Dec 15, 2025</span>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <Button size="sm" variant="outline" className="w-full">
                  View Full Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
