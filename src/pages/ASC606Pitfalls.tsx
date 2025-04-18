
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, ArrowLeft, FileWarning, Shield, CheckCircle, AlertOctagon } from "lucide-react";
import { Link } from "react-router-dom";

export default function ASC606Pitfalls() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
          <ResponsiveContainer className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 transition-transform hover:scale-105 duration-300">
                  <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                5 Common ASC 606 Pitfalls
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>By Michael Chen, CPA</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <time>April 5, 2025</time>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
                  Revenue Recognition
                </Badge>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer className="py-12 md:py-16">
          <article className="prose prose-gray dark:prose-invert mx-auto max-w-4xl">
            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <AlertOctagon className="h-6 w-6 text-destructive" />
              Understanding ASC 606 Challenges
            </h2>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Revenue recognition under ASC 606 continues to challenge accounting teams across industries. Here are the five most common pitfalls we see companies encounter:
            </p>

            <div className="grid gap-8 my-8">
              <div>
                <h3>1. Incorrect Performance Obligation Identification</h3>
                <p>
                  Many companies struggle to properly identify and separate distinct performance obligations within their contracts. This is particularly challenging in software and SaaS arrangements where multiple deliverables are bundled together.
                </p>
              </div>

              <div>
                <h3>2. Variable Consideration Estimation Errors</h3>
                <p>
                  Organizations often miscalculate or overlook variable consideration components like rebates, refunds, or performance bonuses. The constraint on variable consideration requires careful judgment and documentation.
                </p>
              </div>

              <div>
                <h3>3. Standalone Selling Price Determination</h3>
                <p>
                  When observable standalone prices aren't available, companies sometimes use overly simplistic allocation methods that don't reflect the economic substance of their arrangements.
                </p>
              </div>

              <div>
                <h3>4. Contract Modification Complexities</h3>
                <p>
                  Treatment of contract modifications, particularly in long-term arrangements, often trips up accounting teams. The decision between prospective or cumulative catch-up adjustment requires thorough analysis.
                </p>
              </div>

              <div>
                <h3>5. Inadequate Disclosure Documentation</h3>
                <p>
                  Many companies underestimate the extensive disclosure requirements under ASC 606, particularly around remaining performance obligations and significant judgments made in applying the standard.
                </p>
              </div>
            </div>

            <h2>How to Avoid These Pitfalls</h2>
            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Implement robust contract review processes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Document key judgments and assumptions contemporaneously</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Maintain detailed pricing and allocation methodologies</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Regular training and updates for accounting staff</span>
              </li>
            </ul>

            <div className="mt-16 flex justify-center">
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>
          </article>
        </ResponsiveContainer>
      </main>

      <Footer />
    </div>
  );
}
