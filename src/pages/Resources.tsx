import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileSearch, FileText, FileCheck, Download, Book, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Resources() {
  // Observer for scroll animations
  useEffect(() => {
    const animatedCards = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    animatedCards.forEach((card) => {
      observer.observe(card);
    });
    
    return () => {
      animatedCards.forEach((card) => {
        observer.unobserve(card);
      });
    };
  }, []);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Helpful tools and guidance for accounting and finance professionals
            </p>
          </div>
          
          {/* Featured External Resources - Moved to top */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Featured External Resources</h2>
              <div className="h-px flex-grow bg-border/50 ml-4"></div>
            </div>
            <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
              {/* SEC EDGAR */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col">
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/49bf8f26-e72a-4813-ae6e-65275eca9e0b.png" 
                        alt="SEC logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>SEC EDGAR</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Authoritative</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Access public company filings and disclosure documents. Search for financial statements, annual reports, and regulatory filings.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://www.sec.gov/edgar/searchedgar/companysearch" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Deloitte */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/93f201e3-8804-4292-8062-6c3c44f943da.png" 
                        alt="Deloitte logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>Deloitte Accounting Library</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Big 4</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Comprehensive technical accounting guidance and publications. Access in-depth resources on accounting standards and implementation.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://dart.deloitte.com" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* PwC */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/384d5446-f85d-4583-a3ca-92cce2a60fb4.png" 
                        alt="PwC logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>PwC Inform</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Big 4</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    In-depth accounting and financial reporting guidance. Industry-specific resources and technical insights from PwC professionals.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://viewpoint.pwc.com" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              {/* EY */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col" style={{ animationDelay: "300ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/7f20efb4-675d-4fcc-9aee-da6b28444c68.png" 
                        alt="EY logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>EY AccountingLink</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Big 4</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Technical insights on accounting, regulatory and financial reporting. Access EY's interpretations and guidance on complex accounting matters.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://www.ey.com/en_us/assurance/accountinglink" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* KPMG */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col" style={{ animationDelay: "400ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/5439856b-67e6-47c5-8171-7b7b38e9e8c1.png" 
                        alt="KPMG logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>KPMG Guidance Center</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Big 4</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Accounting standards implementation and practical insights. Stay up-to-date with KPMG's interpretations of new and existing standards.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://frv.kpmg.us" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* FASB - New Card */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626] flex flex-col" style={{ animationDelay: "500ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <div className="h-8 w-8 mb-3 mr-3 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/ed9cded5-35b2-4e6c-99b1-57356472c6c6.png" 
                        alt="FASB logo" 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle>FASB Codification</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Standards</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Access the official source of authoritative GAAP, including real-time updates to U.S. accounting standards via the FASB Codification platform.
                  </p>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <a href="https://asc.fasb.org" target="_blank" rel="noopener noreferrer">
                      <span>Visit Resource</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Accounting Standards & Guidance */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Accounting Standards & Guidance</h2>
              <div className="h-px flex-grow bg-border/50 ml-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]">
                <CardHeader>
                  <div className="flex items-start">
                    <Book className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>ASC 606 Guide</CardTitle>
                      <CardDescription>Comprehensive guide to revenue recognition</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Learn about the five-step model for revenue recognition, common implementation challenges, and practical examples.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><Download className="h-4 w-4" /> Download Guide</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Card 2 */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <Book className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>IFRS 15 Overview</CardTitle>
                      <CardDescription>Key points and implementation guidance</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Compare IFRS 15 with ASC 606, understand key differences, and navigate international reporting requirements.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><FileText className="h-4 w-4" /> Access Overview</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <Book className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>Lease Accounting</CardTitle>
                      <CardDescription>ASC 842 and IFRS 16 resources</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Navigate the complexities of lease accounting with our comprehensive guide to classification, measurement and disclosure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><FileText className="h-4 w-4" /> View Resources</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Technical Tools */}
          <div className="mb-20 py-16 bg-accent/30 -mx-4 px-4 md:-mx-6 md:px-6 dark:bg-[#0a0a0a]">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Technical Tools</h2>
                <div className="h-px flex-grow bg-border/50 ml-4 dark:bg-border/20"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]">
                  <CardHeader>
                    <div className="flex items-start">
                      <FileSearch className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                      <div>
                        <CardTitle>Revenue Recognition Calculator</CardTitle>
                        <Badge variant="outline" className="mt-1 mb-2 text-xs font-normal dark:text-gray-300 dark:border-gray-700">Interactive Tool</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Input contract details, performance obligations, and transaction price to get automatic calculations and recognition schedules.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                      <Link to="#"><FileSearch className="h-4 w-4" /> Launch Calculator</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Card 2 */}
                <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "100ms" }}>
                  <CardHeader>
                    <div className="flex items-start">
                      <FileSearch className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                      <div>
                        <CardTitle>Disclosure Checklist</CardTitle>
                        <Badge variant="outline" className="mt-1 mb-2 text-xs font-normal dark:text-gray-300 dark:border-gray-700">Compliance Tool</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Ensure compliance with GAAP and SEC requirements with our checklist covering all required financial statement disclosures.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                      <Link to="#"><FileSearch className="h-4 w-4" /> Access Checklist</Link>
                    </Button>
                  </CardFooter>
                </Card>
                
                {/* Card 3 */}
                <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "200ms" }}>
                  <CardHeader>
                    <div className="flex items-start">
                      <FileSearch className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                      <div>
                        <CardTitle>Impairment Test Tool</CardTitle>
                        <Badge variant="outline" className="mt-1 mb-2 text-xs font-normal dark:text-gray-300 dark:border-gray-700">Analysis Tool</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      Navigate ASC 350 and ASC 360 requirements with our tool that guides you through impairment indicators, testing procedures and calculations.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                      <Link to="#"><FileSearch className="h-4 w-4" /> Use Tool</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Templates & Downloads */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Templates & Downloads</h2>
              <div className="h-px flex-grow bg-border/50 ml-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]">
                <CardHeader>
                  <div className="flex items-start">
                    <FileCheck className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>Technical Memo Template</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">High Quality</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Save time with our professionally designed memo template that includes all essential sections and formatting.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><Download className="h-4 w-4" /> Download Template</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Card 2 */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "100ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <FileCheck className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>White Paper: AI in Finance</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">New</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Explore how artificial intelligence is changing accounting workflows, improving efficiency, and reducing errors.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><Download className="h-4 w-4" /> Download White Paper</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Card 3 */}
              <Card className="animate-on-scroll border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-white/5 dark:bg-[#1c1c1c] dark:hover:bg-[#262626]" style={{ animationDelay: "200ms" }}>
                <CardHeader>
                  <div className="flex items-start">
                    <FileCheck className="h-8 w-8 mb-3 text-primary mr-3 dark:text-[#339CFF]" />
                    <div>
                      <CardTitle>Audit Readiness Checklist</CardTitle>
                      <Badge className="mt-1 bg-[#eef6ff] text-[#0369a1] dark:bg-blue-900/30 dark:text-blue-300">Popular</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    Ensure you're fully prepared for your next audit with our detailed checklist covering documentation, controls, and common audit requests.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="blue" size="sm" className="w-full gap-2 rounded-full" asChild>
                    <Link to="#"><Download className="h-4 w-4" /> Get Checklist</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
