
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FileSearch, FileText, FileCheck, Download, Book, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Resources() {
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
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <Book className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>ASC 606 Guide</CardTitle>
                  <CardDescription>Comprehensive guide to revenue recognition under ASC 606.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Learn about the five-step model for revenue recognition, common implementation challenges, and practical examples.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Download Guide</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <Book className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>IFRS 15 Overview</CardTitle>
                  <CardDescription>Key points and implementation guidance for IFRS 15.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Compare IFRS 15 with ASC 606, understand key differences, and navigate international reporting requirements.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Access Overview</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <Book className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Lease Accounting</CardTitle>
                  <CardDescription>ASC 842 and IFRS 16 implementation resources.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Navigate the complexities of lease accounting with our comprehensive guide to classification, measurement and disclosure.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">View Resources</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Technical Tools */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Technical Tools</h2>
              <div className="h-px flex-grow bg-border/50 ml-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileSearch className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Revenue Recognition Calculator</CardTitle>
                  <CardDescription>Interactive tool to help calculate revenue recognition timing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Input contract details, performance obligations, and transaction price to get automatic calculations and recognition schedules.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Launch Calculator</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileSearch className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Disclosure Checklist</CardTitle>
                  <CardDescription>Comprehensive checklist for financial statement disclosures.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensure compliance with GAAP and SEC requirements with our checklist covering all required financial statement disclosures.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Access Checklist</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileSearch className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Impairment Test Tool</CardTitle>
                  <CardDescription>Step-by-step tool for conducting impairment tests.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Navigate ASC 350 and ASC 360 requirements with our tool that guides you through impairment indicators, testing procedures and calculations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Use Tool</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Templates & Downloads */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Templates & Downloads</h2>
              <div className="h-px flex-grow bg-border/50 ml-4"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileCheck className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Technical Memo Template</CardTitle>
                  <CardDescription>Standardized template for creating technical accounting memos.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Save time with our professionally designed memo template that includes all essential sections and formatting.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Download Template</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileCheck className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>White Paper: AI in Finance</CardTitle>
                  <CardDescription>Research on how AI is transforming accounting and finance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore how artificial intelligence is changing accounting workflows, improving efficiency, and reducing errors.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Download White Paper</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-border/40 bg-card/50 backdrop-blur hover:bg-card/80 transition-colors">
                <CardHeader>
                  <FileCheck className="h-8 w-8 mb-3 text-primary" />
                  <CardTitle>Audit Readiness Checklist</CardTitle>
                  <CardDescription>Prepare for your next audit with this comprehensive checklist.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ensure you're fully prepared for your next audit with our detailed checklist covering documentation, controls, and common audit requests.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="#">Get Checklist</Link>
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
