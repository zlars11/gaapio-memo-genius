
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileSearch, FileText, FileCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Resources() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-32">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Helpful tools and guidance for accounting and finance professionals
            </p>
          </div>
          
          {/* Accounting Standards & Guidance */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Accounting Standards & Guidance</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileText className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">ASC 606 Guide</h3>
                <p className="text-muted-foreground mb-4">Comprehensive guide to revenue recognition under ASC 606.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Download Guide</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileText className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">IFRS 15 Overview</h3>
                <p className="text-muted-foreground mb-4">Key points and implementation guidance for IFRS 15.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Access Overview</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileText className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Lease Accounting</h3>
                <p className="text-muted-foreground mb-4">ASC 842 and IFRS 16 implementation resources.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">View Resources</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Technical Tools */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Technical Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileSearch className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Revenue Recognition Calculator</h3>
                <p className="text-muted-foreground mb-4">Interactive tool to help calculate revenue recognition timing.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Launch Calculator</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileSearch className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Disclosure Checklist</h3>
                <p className="text-muted-foreground mb-4">Comprehensive checklist for financial statement disclosures.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Access Checklist</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileSearch className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Impairment Test Tool</h3>
                <p className="text-muted-foreground mb-4">Step-by-step tool for conducting impairment tests.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Use Tool</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Templates & Downloads */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 border-b pb-2">Templates & Downloads</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileCheck className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Technical Memo Template</h3>
                <p className="text-muted-foreground mb-4">Standardized template for creating technical accounting memos.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Download Template</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileCheck className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">White Paper: AI in Finance</h3>
                <p className="text-muted-foreground mb-4">Research on how AI is transforming accounting and finance.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Download White Paper</Link>
                </Button>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                <FileCheck className="h-8 w-8 mb-4 text-primary" />
                <h3 className="text-xl font-medium mb-2">Audit Readiness Checklist</h3>
                <p className="text-muted-foreground mb-4">Prepare for your next audit with this comprehensive checklist.</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="#">Get Checklist</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
