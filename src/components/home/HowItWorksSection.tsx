
import { FileSearch, FileCheck, Download } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-accent/50">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your accounting documentation workflow in three simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
              <FileSearch className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Guided Prompts</h3>
            <p className="text-muted-foreground">
              Answer a series of targeted questions to generate accurate accounting memos.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
              <FileCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Review</h3>
            <p className="text-muted-foreground">
              Our AI generates a professional accounting memo. Review and make any final adjustments.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-6">
              <Download className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Download</h3>
            <p className="text-muted-foreground">
              Download your complete, audit-ready accounting memo in your preferred format.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
