
import { memo } from "react";
import { MessageSquare, Zap, CheckCircle, Users } from "lucide-react";

export const DisclosureHowItWorksSection = memo(function DisclosureHowItWorksSection() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Draft Disclosures",
      description: "Generate new disclosures, roll forward previous, or upload from another software then let our AI go to work."
    },
    {
      icon: Users,
      title: "Benchmark", 
      description: "Analyze your peer group or any other public company with the click of a button. Want to see if you are over or under disclosing? Let our AI analyze you and your peer group."
    },
    {
      icon: CheckCircle,
      title: "AI completed Checklist",
      description: "Let our AI take the first pass at either our proprietary footnote checklist or upload your auditors checklist."
    },
    {
      icon: Zap,
      title: "Format",
      description: " CPA approved, industry leading formatting."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 dark:text-white">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto dark:text-gray-300">
            Create comprehensive footnote disclosures in minutes with our AI-powered platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#339CFF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 bg-[#339CFF]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-[#339CFF]" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed dark:text-gray-300">
                  {step.description}
                </p>
                
                {/* Decorative Element */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#339CFF] to-[#1F8FFF] rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md border border-gray-100 dark:border-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Compliance-ready footnote disclosures in minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
