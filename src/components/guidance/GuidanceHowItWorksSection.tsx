
import { Monitor, Bell, BookOpen, Users } from "lucide-react";

export function GuidanceHowItWorksSection() {
  const steps = [
    {
      icon: Monitor,
      title: "Monitor",
      description: "We track FASB, IASB, PCAOB, and SEC updates daily."
    },
    {
      icon: Bell,
      title: "Alert",
      description: "You're instantly notified when something changes."
    },
    {
      icon: BookOpen,
      title: "Explain",
      description: "We break it down with plain-language analysis written by CPAs."
    },
    {
      icon: Users,
      title: "Educate",
      description: "Optional deep dives and summaries for your whole team."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            How Gaapio Guidance Updates Work
          </h2>
          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
            Stay ahead of accounting standards with our comprehensive monitoring and alert system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-300">
                <step.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
