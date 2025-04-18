import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, ArrowLeft, BookOpen, CheckCircle, Shield, History, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function BlogPost() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        {/* Hero Section with enhanced styling */}
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
          <ResponsiveContainer className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105 duration-300">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                Why Technical Accounting Memos Matter
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>By Zack Larsen, CPA</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <time>April 10, 2025</time>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
                  Best Practices
                </Badge>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        {/* Content Section with improved typography and spacing */}
        <ResponsiveContainer className="py-12 md:py-16">
          <article className="prose prose-gray dark:prose-invert mx-auto max-w-4xl">
            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
              What Is a Technical Accounting Memo?
            </h2>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              A technical accounting memo is a formal document prepared by a company's finance or accounting team to analyze and document the rationale behind significant accounting decisions. These typically include judgments around complex areas like:
            </p>
            
            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Revenue recognition (ASC 606)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Lease accounting (ASC 842)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Business combinations (ASC 805)</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Impairment assessments</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Debt vs. equity classification</span>
              </li>
            </ul>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-8">
              The memo outlines the relevant facts, references applicable accounting standards (usually U.S. GAAP or IFRS), explores alternative treatments, and clearly states the company's chosen approach - all backed by authoritative guidance.
            </p>

            <Separator className="my-12" />

            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-6">
              <Shield className="h-6 w-6 text-primary" />
              Why Do These Memos Matter?
            </h2>
            
            <div className="grid gap-8 my-8">
              <div>
                <h3>1. Audit Defense</h3>
                <p>
                  Auditors love documentation. A well-written memo demonstrates that management performed a thorough analysis and applied professional judgment. It helps reduce back-and-forth during audits and provides support that your accounting positions are defensible.
                </p>
              </div>

              <div>
                <h3>2. Regulatory Compliance</h3>
                <p>
                  Public and private companies alike are held to rigorous standards. Technical memos show regulators (and internal stakeholders) that your company is following the rules - and that your accounting isn't based on guesswork or outdated interpretations.
                </p>
              </div>

              <div>
                <h3>3. Consistency Over Time</h3>
                <p>
                  Accounting positions often span multiple periods. Documenting your rationale now ensures continuity and prevents knowledge loss if team members change. When you revisit an issue next quarter or next year, the memo becomes a crucial reference point.
                </p>
              </div>

              <div>
                <h3>4. Stakeholder Confidence</h3>
                <p>
                  Whether it's investors, auditors, board members, or potential acquirers, stakeholders want to know your financials are grounded in solid, professional analysis. Well-prepared technical memos help build that confidence.
                </p>
              </div>
            </div>

            <h2>The Problem: Writing These Memos Is a Drag</h2>
            <p>
              Despite their importance, technical memos are time-consuming and often get pushed to the back burner. They require deep technical knowledge, careful wording, and meticulous formatting. In fast-paced finance teams, it's easy to fall behind - or worse, skip them altogether.
            </p>

            <h2>The Solution: AI-Powered, CPA-Approved</h2>
            <p>
              That's where Gaapio comes in.
            </p>
            <p>
              Our platform helps accounting teams create high-quality technical memos in seconds. Whether you're addressing ASC 606 or lease classification, Gaapio leverages advanced AI - trained on authoritative guidance - to generate memos that are fast, accurate, and audit-ready.
            </p>
            <p>
              You get the best of both worlds: the efficiency of AI with the credibility of CPA-approved logic.
            </p>

            <h2>Final Thoughts</h2>
            <p>
              Technical accounting memos aren't just documentation - they're protection. They protect your financial statements, your audit trail, and your professional reputation.
            </p>
            <p>
              With tools like Gaapio, you no longer have to choose between speed and accuracy. You get both - in seconds.
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
