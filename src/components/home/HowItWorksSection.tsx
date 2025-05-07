
import { FileSearch, FileCheck, Download } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-accent/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your technical accounting memos in three powerful steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1 */}
          <div className="flex flex-col text-center bg-background/60 border border-border/30 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-6 mx-auto" aria-hidden="true">
              <FileSearch className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Guided Prompts</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Built-in guardrails for accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Up-to-date with latest standards</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Drafted instantly by trained AI</span>
              </li>
            </ul>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col text-center bg-background/60 border border-border/30 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-6 mx-auto" aria-hidden="true">
              <FileCheck className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Review</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Proprietary AI reviews and gives suggestions</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>One-click edits and enhancements</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Internal sign offs and audit trail</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Optional CPA review</span>
              </li>
            </ul>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col text-center bg-background/60 border border-border/30 p-6 rounded-lg shadow-sm">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-primary/10 mb-6 mx-auto" aria-hidden="true">
              <Download className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Manage & Deliver</h3>
            <ul className="text-muted-foreground text-left text-sm space-y-2">
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Presentation-ready memos and disclosures</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Full version history and reviewer comments</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>Exportable audit reports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
