
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, ArrowLeft, Robot, Zap, MicrochipIcon, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AIAccounting() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
          <ResponsiveContainer className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-105 duration-300">
                  <Brain className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                How AI Is Changing the Accounting Landscape
              </h1>
              
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Robot className="h-4 w-4" />
                  <span>By David Miller, CPA</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <time>March 28, 2025</time>
                </div>
                <span>•</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/15">
                  Technology
                </Badge>
              </div>
            </div>
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer className="py-12 md:py-16">
          <article className="prose prose-gray dark:prose-invert mx-auto max-w-4xl">
            <h2 className="flex items-center gap-3 text-2xl font-bold mt-8 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              The AI Revolution in Accounting
            </h2>
            
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Artificial Intelligence is transforming the accounting profession at an unprecedented pace. From automated data entry to intelligent analysis, AI is reshaping how accountants work and adding value to their organizations.
            </p>

            <div className="grid gap-8 my-8">
              <div>
                <h3 className="flex items-center gap-2">
                  <MicrochipIcon className="h-5 w-5 text-primary" />
                  Automated Data Processing
                </h3>
                <p>
                  AI-powered systems can now process thousands of transactions in seconds, categorize them accurately, and flag anomalies for review. This automation drastically reduces manual data entry and reconciliation time.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Intelligent Analysis
                </h3>
                <p>
                  Machine learning algorithms can analyze historical data to identify patterns, predict trends, and provide insights that would be difficult for humans to discover manually.
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Process Optimization
                </h3>
                <p>
                  AI systems can learn from past actions and continuously improve their accuracy and efficiency, leading to optimized workflows and reduced error rates.
                </p>
              </div>
            </div>

            <h2>Impact on Accounting Roles</h2>
            <ul className="space-y-3 my-6">
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Shift from data entry to strategic analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Enhanced focus on interpretation and decision-making</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>New skill requirements in technology and data analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Greater emphasis on advisory services</span>
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
