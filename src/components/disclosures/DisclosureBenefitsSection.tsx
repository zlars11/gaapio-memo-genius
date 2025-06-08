
import { memo } from "react";
import { Clock, Shield, Target, Zap, Users, CheckCircle } from "lucide-react";

export const DisclosureBenefitsSection = memo(function DisclosureBenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Generate comprehensive footnote disclosures in minutes, not hours"
    },
    {
      icon: Shield,
      title: "Ensure Compliance",
      description: "Stay current with ASC 842 requirements and audit standards"
    },
    {
      icon: Target,
      title: "Improve Accuracy",
      description: "Reduce errors with AI-powered analysis and verification"
    },
    {
      icon: Zap,
      title: "Boost Efficiency",
      description: "Streamline your disclosure process with automated workflows"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enable seamless review and approval processes across your team"
    },
    {
      icon: CheckCircle,
      title: "Audit Ready",
      description: "Generate audit-ready documentation with complete traceability"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-white dark:bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your footnote disclosure process with AI-powered automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-all duration-500 h-full flex flex-col min-h-[280px]"
              >
                {/* Icon Circle */}
                <div className="flex justify-center mb-6">
                  <Icon className="h-8 w-8 text-[#2B70F7]" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-bold mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 px-8 py-4 rounded-full border border-blue-200 dark:border-blue-800">
            <CheckCircle className="w-6 h-6 text-[#2B70F7]" />
            <span className="text-lg font-medium text-[#2B70F7]">
              Compliance-ready footnote disclosures in minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
