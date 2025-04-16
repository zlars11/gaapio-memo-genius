import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WaitlistForm } from "@/components/waitlist-form";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle, CheckCircle2, Upload, FileCheck, Download, Clock, Shield, FileText, FileSearch } from "lucide-react";
import { useEffect, useState } from "react";

export default function Index() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize based on system/user preference
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches || document.documentElement.classList.contains("dark"));
    
    // Listen for changes in the color scheme and theme toggle
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches || document.documentElement.classList.contains("dark"));
    };
    
    darkModeQuery.addEventListener("change", handleChange);
    
    // Listen for changes to the dark class on the document
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    // Additional listener for theme toggle changes
    const handleStorageEvent = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    
    window.addEventListener('storage', handleStorageEvent);
    
    return () => {
      darkModeQuery.removeEventListener("change", handleChange);
      observer.disconnect();
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Hero Section with Background Memo */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative hero-glow">
        {/* Background Memo Image - More Transparent */}
        <div className="absolute top-[45%] right-0 transform -translate-y-1/4 opacity-5 z-0 pointer-events-none">
          <img 
            src={isDark ? "/lovable-uploads/01273276-ea88-43e0-9d91-0cb238f997be.png" : "/lovable-uploads/e13abd02-7766-469a-af2d-18a152812501.png"} 
            alt="ASC 606 Memo" 
            className="w-[800px] h-auto rotate-6"
          />
        </div>
        
        <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up">
            Technical accounting memos in seconds
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl animate-fade-up" style={{ animationDelay: "100ms" }}>
            AI-Powered. CPA-Approved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" asChild>
              <a href="#waitlist">Join the Waitlist</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
            <ArrowDownCircle className="h-10 w-10 text-muted-foreground/50 animate-pulse-slow" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-accent/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Streamline your accounting documentation workflow in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                <FileSearch className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Guided Prompts</h3>
              <p className="text-muted-foreground">
                Answer a series of targeted questions to generate accurate accounting memos.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Review</h3>
              <p className="text-muted-foreground">
                Our AI generates a professional accounting memo. Review and make any final adjustments.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Download</h3>
              <p className="text-muted-foreground">
                Download your complete, audit-ready accounting memo in your preferred format.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section id="benefits" className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform offers significant advantages over traditional memo creation.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Benefit 1 */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CPA-Level Output</h3>
              <p className="text-muted-foreground">
                AI-generated memos that match the quality of experienced CPAs.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GAAP/IFRS Compliance</h3>
              <p className="text-muted-foreground">
                Always up-to-date with the latest accounting standards and guidelines.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Audit-Ready Format</h3>
              <p className="text-muted-foreground">
                Structured documentation that satisfies auditor requirements.
              </p>
            </div>
            
            {/* Benefit 4 */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
              <p className="text-muted-foreground">
                Reduce memo creation time by up to 90% compared to manual methods.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-accent/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Finance Teams Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Industry professionals trust Gaapio for their accounting documentation needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <p className="mb-4 italic">
                "Gaapio has transformed our month-end close process. What used to take hours now takes minutes, with even better quality."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">VP Finance, Enterprise Co.</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <p className="mb-4 italic">
                "The accounting memos generated by Gaapio are consistently accurate and thorough. Our audit team has been impressed."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">Controller, Tech Inc.</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-background rounded-lg p-6 shadow-sm">
              <p className="mb-4 italic">
                "As a CPA, I was skeptical of AI-written memos, but Gaapio has proven to be an invaluable assistant to our accounting team."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <span className="font-medium">AW</span>
                </div>
                <div>
                  <p className="font-medium">Amanda Wilson</p>
                  <p className="text-sm text-muted-foreground">Senior CPA, Accounting Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA / Waitlist Section */}
      <section id="waitlist" className="py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Waitlist Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be among the first to experience the future of accounting memo creation.
              Limited spots available for our beta program.
            </p>
            <WaitlistForm />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
