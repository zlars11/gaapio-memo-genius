import { Button } from "@/components/ui/button";
import { memo } from "react";
import { Link } from "react-router-dom";

interface ContractHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const ContractHeroSection = memo(function ContractHeroSection({ 
  title = "AI-Powered Contract Intelligence",
  subtitle = "Extract Key Terms. Identify Accounting Implications. Ensure Compliance."
}: ContractHeroSectionProps) {
  
  return (
    <section className="relative min-h-[100vh] md:min-h-[85vh] flex flex-col justify-center items-center pt-32 pb-20 md:pb-12 bg-white dark:bg-background overflow-hidden">
      <div className="container px-4 md:px-6 text-center relative z-10">
        
        {/* Text content centered */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-up dark:text-white">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-up dark:text-gray-300" style={{ animationDelay: "100ms" }}>
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" variant="blue" asChild>
              <Link to="/request-demo">Request a Demo</Link>
            </Button>
            <Button size="lg" variant="blueOutline" asChild>
              <Link to="/contact">Ask a Question</Link>
            </Button>
          </div>
        </div>
        
        {/* Contract Analysis mockup centered */}
        <div className="flex justify-center animate-fade-up" style={{ animationDelay: "300ms" }}>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Lease Agreement#3</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Key Insights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Key Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-medium text-blue-900 dark:text-blue-300">KEY TERMS EXTRACTED</div>
                    <div className="text-blue-700 dark:text-blue-400 mt-1">
                      <strong>Leased Premises:</strong> 7,041 square feet of warehouse/office space
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-medium text-green-900 dark:text-green-300">Lease Term:</div>
                    <div className="text-green-700 dark:text-green-400">Commences on May 15, 2004, terminates on May 31, 2008</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="font-medium text-purple-900 dark:text-purple-300">Base Rent:</div>
                    <div className="text-purple-700 dark:text-purple-400">Starting at $3,000 per month, increasing to $3,625</div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="font-medium text-orange-900 dark:text-orange-300">Security Deposit:</div>
                    <div className="text-orange-700 dark:text-orange-400">$4,000 to be paid upon execution</div>
                  </div>
                </div>
              </div>

              {/* Right side - AI Analysis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Analysis</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">Accounting Treatment Recommendation:</div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    The security deposit should be treated as a liability until it is either refunded to the tenant or applied to cover any damages or unpaid rent at the lease's conclusion.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>Debit:</strong> Security Deposit Liability (Liability) $4,000
                      </span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>Credit:</strong> Repair Expense (Expense) $4,000 (if applied to damages)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});