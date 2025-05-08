
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, FileText, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function OnePager() {
  const contentRef = useRef<HTMLDivElement>(null);
  
  const downloadAsPdf = async () => {
    if (!contentRef.current) return;
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save('gaapio-one-pager.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" ref={contentRef}>
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pb-24 relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-tight">
                  Accounting memos — automated, accurate, and audit-ready.
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Gaapio is the AI memo assistant for accounting teams. Built by CPAs, it drafts 
                  technical memos with precision, helping your team move faster while staying GAAP-compliant.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                    <Link to="/contact">Book a Demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/">Website</a>
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="rounded-xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" 
                    alt="Finance professionals in meeting" 
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Screenshot Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-accent/30 to-background relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Streamlined Memo Creation
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our intuitive interface makes technical accounting documentation simple.
              </p>
            </div>
            
            <div className="relative mx-auto max-w-4xl">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border">
                <div className="bg-card p-2 border-b flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Revenue Recognition Memo - ASC 606</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">AI-generated content</span>
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded">Editable</span>
                    <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded">Export to PDF</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold mb-2">1. Background and Transaction Summary</h3>
                      <p className="text-sm text-muted-foreground">
                        SaaS Inc. entered into a contract with Client Co. on January 1, 2023, to provide software 
                        licenses, implementation services, and post-contract support for a total consideration of 
                        $500,000 over a three-year term...
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">2. Applicable Guidance</h3>
                      <p className="text-sm text-muted-foreground">
                        ASC 606-10-25-1 outlines the five-step model for revenue recognition:
                      </p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 mt-2">
                        <li>Identify the contract with a customer</li>
                        <li>Identify the performance obligations in the contract</li>
                        <li>Determine the transaction price</li>
                        <li>Allocate the transaction price to the performance obligations</li>
                        <li>Recognize revenue when (or as) each performance obligation is satisfied</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold mb-2">3. Analysis and Conclusion</h3>
                      <p className="text-sm text-muted-foreground">
                        Based on our assessment of the contract terms and conditions and application of 
                        ASC 606 guidance, we have identified three distinct performance obligations...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Key Gaapio Capabilities</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Advanced AI built specifically for accounting and finance teams.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto">
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">Built by Big 4 CPAs</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">Aligned to U.S. GAAP</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">Fast, accurate memo drafts</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">Designed for controllers and CFOs</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">No technical setup required</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">Fully editable output</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">AI tuned for accounting standards</p>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-6 w-6 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-lg">SOC 2 Ready & Privacy-First</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-t-[3rem] overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-6">
                Why Gaapio?
              </h2>
              
              <div className="space-y-4 text-lg md:text-xl">
                <p>We built Gaapio because writing memos sucks.</p>
                
                <p>You're juggling ASC guidance, internal policy, and audit risk — all under a deadline.</p>
                
                <p>Gaapio helps you move faster, stay compliant, and free up your team for more important work.</p>
              </div>
              
              <div className="mt-10">
                <Button onClick={downloadAsPdf} size="lg" className="bg-primary hover:bg-primary/90">
                  Download One-Pager <Download className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <div className="bg-muted py-8">
        <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
          <div className="w-40 mb-4">
            <img 
              src="/lovable-uploads/abd3ce27-cd6d-4b4b-9a0e-61f70caa6748.png" 
              alt="Gaapio Logo" 
              className="w-full h-auto"
            />
          </div>
          
          <p className="text-center text-muted-foreground">
            AI Powered. CPA Approved.
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
