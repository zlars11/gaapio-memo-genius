import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { FileText, Search, Brain, CheckCircle } from "lucide-react";
import { memo } from "react";

export const ContractHowItWorksSection = memo(function ContractHowItWorksSection() {
  const steps = [
    {
      icon: FileText,
      title: "Upload Your Contract",
      description: "Simply upload any contract type - leases, revenue agreements, service contracts, or partnership agreements. Our AI supports all major formats."
    },
    {
      icon: Search,
      title: "AI Extracts Key Terms",
      description: "Our trained AI identifies and extracts critical accounting terms, dates, amounts, and conditions that impact financial reporting and compliance."
    },
    {
      icon: Brain,
      title: "Intelligent Analysis",
      description: "Advanced algorithms analyze contract terms for lease classification, revenue recognition patterns, embedded derivatives, and other accounting implications."
    },
    {
      icon: CheckCircle,
      title: "Compliance Guidance",
      description: "Receive detailed recommendations for proper accounting treatment under current GAAP standards, including ASC 606, ASC 842, and other relevant guidance."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            How Contract Analysis Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Transform complex contracts into clear accounting insights with our AI-powered analysis platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <IconComponent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Ready to streamline your contract analysis?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of accounting professionals who trust Gaapio to handle their most complex contract analysis needs.
            </p>
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
});