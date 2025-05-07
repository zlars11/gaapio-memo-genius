
import { FileText, Shield, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our trained AI platform will give you confidence in your approach while saving time and money.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Benefit 1 - Audit Ready (moved to first position) */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Audit Ready</h3>
            <p className="text-muted-foreground">
              Structured documentation that satisfies auditor requirements including version history and review notes.
            </p>
          </div>
          
          {/* Benefit 2 - Time & Cost Savings (moved to second position) */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time & Cost Savings</h3>
            <p className="text-muted-foreground">
              Cut memo and disclosure creation time by up to 90%. Make your internal team look like rockstars — or save thousands compared to outsourced memos.
            </p>
          </div>
          
          {/* Benefit 3 - CPA-Level Output */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CPA-Level Output</h3>
            <p className="text-muted-foreground">
              AI-generated memos and disclosures that match or exceed the quality of experienced CPAs.
            </p>
          </div>
          
          {/* Create a div to center the bottom two benefits */}
          <div className="sm:col-span-2 lg:col-span-3 grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Benefit 4 - GAAP/IFRS Compliance */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GAAP/IFRS Compliance</h3>
              <p className="text-muted-foreground">
                Always up-to-date with the latest accounting standards and guidelines.
              </p>
            </div>
            
            {/* Benefit 5 - Enterprise-Grade Security */}
            <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
              <div className="mb-4 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
              <p className="text-muted-foreground">
                Your data stays private — never used to train public AI models. We follow strict security protocols to protect your information and maintain full confidentiality.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
