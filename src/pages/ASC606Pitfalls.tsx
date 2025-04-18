
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileWarning, CheckCircle, AlertTriangle, FileCheck, Shield, Zap } from "lucide-react";
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
                  <FileWarning className="h-10 w-10 text-destructive" />
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                5 Common ASC 606 Pitfalls
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>By Zack Larsen, CPA</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <time>October 29, 2025</time>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
                  Accounting Standards
                </Badge>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer className="py-12 md:py-16">
          <article className="prose prose-gray dark:prose-invert mx-auto max-w-4xl">
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Since the adoption of ASC 606, companies have made meaningful strides toward aligning their revenue recognition practices with the standard. But even years after implementation, the complexities of ASC 606 continue to trip up accounting teams—especially in high-growth or contract-heavy environments.
            </p>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              As a CPA who works closely with finance leaders and technical accounting teams, I continue to see the same issues surface time and time again. Below are five of the most common ASC 606 pitfalls—and how to avoid them.
            </p>

            <div className="grid gap-8 my-8">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  1. Incorrect Performance Obligation Identification
                </h3>
                <p>
                  One of the foundational steps under ASC 606 is identifying the distinct performance obligations in a contract. Yet many companies, particularly those in software, SaaS, or services, continue to misclassify deliverables.
                </p>
                <p>
                  Bundled arrangements that include implementation, licenses, and ongoing support often require significant judgment. Failure to separate these elements correctly can result in materially misstated revenue timing.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg mt-4">
                  <p className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Pro Tip: Establish a consistent contract review framework to evaluate whether goods or services are distinct based on customer benefit and separability.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  2. Variable Consideration Estimation Errors
                </h3>
                <p>
                  Variable consideration—including discounts, rebates, service-level penalties, or performance bonuses—must be estimated and included in the transaction price using either the expected value or most likely amount approach.
                </p>
                <p>
                  Many companies underestimate these components or fail to apply the constraint correctly. Overstating variable consideration can lead to premature revenue recognition, while excessive conservatism can distort financials.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg mt-4">
                  <p className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Pro Tip: Support all estimates with contemporaneous documentation and reassess them regularly as new data becomes available.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  3. Weak Standalone Selling Price (SSP) Methodology
                </h3>
                <p>
                  When observable pricing isn't available, companies often default to arbitrary or overly simplified methods to allocate transaction price—especially in bundled contracts. This can result in non-compliance and inconsistent application across similar deals.
                </p>
                <p>
                  ASC 606 expects that SSPs reflect the price at which the entity would sell a good or service separately under similar circumstances—not just a straight-line allocation.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg mt-4">
                  <p className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Pro Tip: Use a data-driven approach—such as cost-plus or adjusted market assessment—and update it periodically as your pricing evolves.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  4. Contract Modification Confusion
                </h3>
                <p>
                  Accounting for contract modifications is one of the trickiest areas under ASC 606. Whether a change is treated prospectively or as a cumulative catch-up depends on whether the modification adds distinct goods or services and whether those additions are priced at SSP.
                </p>
                <p>
                  Many companies either default to one method or fail to document the rationale for their approach—putting them at risk during audits.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg mt-4">
                  <p className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Pro Tip: Treat every modification as a separate accounting event. Create a checklist to evaluate whether the modification constitutes a new contract, a continuation, or a combination.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  5. Inadequate Disclosure Documentation
                </h3>
                <p>
                  ASC 606's disclosure requirements are expansive—especially around judgments made, the timing of revenue recognition, and remaining performance obligations. Yet many companies treat disclosures as an afterthought, leading to incomplete or boilerplate language in financial statements.
                </p>
                <p>
                  This not only raises red flags with auditors but also reduces transparency for investors and stakeholders.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg mt-4">
                  <p className="flex items-center gap-2 font-medium">
                    <Zap className="h-4 w-4 text-primary" />
                    Pro Tip: Build out detailed disclosure templates early and update them throughout the year—not just during year-end reporting.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
              <FileCheck className="h-6 w-6 text-primary" />
              How to Avoid These Pitfalls
            </h2>

            <p className="mb-6">Here's a quick checklist to keep your revenue recognition process on track:</p>

            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Implement a robust contract review process</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Document all key judgments and assumptions at the time decisions are made</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Maintain detailed and supportable SSP methodologies</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Train your accounting team regularly on ASC 606 updates and industry-specific challenges</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Leverage AI and automation tools to identify inconsistencies and support internal controls</span>
              </li>
            </ul>

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              Final Thoughts
            </h2>
            
            <p className="text-lg leading-relaxed mb-6">
              ASC 606 is here to stay—and while it's complex, it doesn't have to be overwhelming. By proactively addressing common pitfalls, documenting your positions, and investing in ongoing education and process improvement, your team can stay ahead of the curve and avoid costly misstatements.
            </p>

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
