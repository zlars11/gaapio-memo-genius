
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, CheckCircle2 } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatedMemo } from "./AnimatedMemo";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const HeroSection = memo(function HeroSection() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Scroll to How It Works section when arrow is clicked
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center pt-16 pb-12 dark:bg-background">
      {/* Hero content with improved spacing */}
      <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center relative z-10 mt-16 md:mt-20">
        {/* Left side - Text content */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
            Audit Ready Memos and Disclosures
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
            AI-Powered. CPA-Approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">Request a demo</Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/signup">Sign Up Now</Link>
            </Button>
          </div>
          
          {/* Core offerings with checkmarks */}
          <div className="space-y-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <div className="flex items-center">
              <div className="p-1 rounded-full bg-[#0074d4]/10 mr-2">
                <CheckCircle2 className="h-5 w-5 text-[#0074d4]" />
              </div>
              <span className="font-medium">Technical Accounting Memos</span>
            </div>
            <div className="flex items-center">
              <div className="p-1 rounded-full bg-[#0074d4]/10 mr-2">
                <CheckCircle2 className="h-5 w-5 text-[#0074d4]" />
              </div>
              <span className="font-medium">Footnote Disclosures</span>
            </div>
          </div>
        </div>
        
        {/* Right side - Professional image */}
        <div className="w-full h-full flex justify-center items-center">
          <div className="w-full overflow-hidden rounded-xl shadow-lg">
            <AspectRatio ratio={4/3}>
              <img 
                src="/lovable-uploads/c45fd480-1870-4963-9797-c53223261a19.png"
                alt="Accounting Team Collaboration" 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
          </div>
        </div>
      </div>
      
      {/* Down arrow for scrolling to How It Works section */}
      <div 
        className="animate-fade-up absolute bottom-6" 
        style={{ animationDelay: "400ms" }} 
        onClick={scrollToHowItWorks}
      >
        <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 dark:text-gray-400/70 animate-pulse-slow cursor-pointer" aria-hidden="true" />
      </div>
    </section>
  );
});
