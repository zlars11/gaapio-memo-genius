
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileSearch, FileText, FileCheck, Download, Book, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ResourceExternalCard } from "@/components/resources/ResourceExternalCard";

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
              
              {/* Card 3 */}
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
          
          {/* Featured External Resources - New Section */}
          <div className="py-16 bg-accent/30 -mx-4 px-4 md:-mx-6 md:px-6 dark:bg-[#0a0a0a]">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Featured External Resources</h2>
                <div className="h-px flex-grow bg-border/50 ml-4 dark:bg-border/20"></div>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-5">
                <ResourceExternalCard 
                  title="SEC EDGAR"
                  description="Access public company filings and disclosure documents."
                  imageUrl="/lovable-uploads/46cd9a78-e198-4c02-8bb3-54dd178bcc07.png"
                  link="https://www.sec.gov/edgar/searchedgar/companysearch"
                  delay={0}
                />
                
                <ResourceExternalCard 
                  title="Deloitte Accounting Library"
                  description="Comprehensive technical accounting guidance and publications."
                  imageUrl="/lovable-uploads/d0db1379-3bdf-4c82-b7ac-4e9b270af3aa.png"
                  link="https://dart.deloitte.com"
                  delay={100}
                />
                
                <ResourceExternalCard 
                  title="PwC Inform"
                  description="In-depth accounting and financial reporting guidance."
                  imageUrl="/lovable-uploads/c45fd480-1870-4963-9797-c53223261a19.png"
                  link="https://viewpoint.pwc.com"
                  delay={200}
                />
                
                <ResourceExternalCard 
                  title="EY AccountingLink"
                  description="Technical insights on accounting, regulatory and financial reporting."
                  imageUrl="/lovable-uploads/e263b9d6-518b-411f-be9f-c36067fd9ad1.png"
                  link="https://www.ey.com/en_us/assurance/accountinglink"
                  delay={300}
                />
                
                <ResourceExternalCard 
                  title="KPMG Guidance Center"
                  description="Accounting standards implementation and practical insights."
                  imageUrl="/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png"
                  link="https://frv.kpmg.us"
                  delay={400}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
