
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

export const HeroSection = memo(function HeroSection() {
  // Scroll to How It Works section when arrow is clicked
  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
          CPA Trusted Accounting Memos in Seconds
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl animate-fade-up" style={{ animationDelay: "100ms" }}>
          AI-Powered. CPA-Approved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <Button size="lg" variant="default" asChild>
            <Link to="/contact">Request a demo</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "300ms" }} onClick={scrollToHowItWorks}>
          <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 animate-pulse-slow cursor-pointer" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
});
