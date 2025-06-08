
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
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Key Benefits
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Transform your footnote disclosure process with AI-powered automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="group text-center"
              >
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-10 h-10 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {benefit.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom highlight */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-white/20 px-8 py-4 rounded-full border border-white/30">
            <CheckCircle className="w-6 h-6 text-white" />
            <span className="text-lg font-medium text-white">
              Compliance-ready footnote disclosures in minutes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});
