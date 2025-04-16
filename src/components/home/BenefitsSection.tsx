
import { FileText, Shield, CheckCircle2, Clock } from "lucide-react";

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform offers significant advantages over traditional memo creation.
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Benefit 1 */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">CPA-Level Output</h3>
            <p className="text-muted-foreground">
              AI-generated memos that match the quality of experienced CPAs.
            </p>
          </div>
          
          {/* Benefit 2 */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <Shield className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">GAAP/IFRS Compliance</h3>
            <p className="text-muted-foreground">
              Always up-to-date with the latest accounting standards and guidelines.
            </p>
          </div>
          
          {/* Benefit 3 */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Audit-Ready Format</h3>
            <p className="text-muted-foreground">
              Structured documentation that satisfies auditor requirements.
            </p>
          </div>
          
          {/* Benefit 4 */}
          <div className="group glass-card p-6 rounded-lg transition-all hover:shadow-md">
            <div className="mb-4 text-primary">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
            <p className="text-muted-foreground">
              Reduce memo creation time by up to 90% compared to manual methods.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
