
import { CheckCircle, FileText, Clock } from "lucide-react";

export function GuidanceMakesSenseSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#f4faff] to-white dark:from-[#1A1F2B] dark:to-[#1A1F2B]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Guidance That Makes Sense
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
              Most updates are filled with legal jargon. Gaapio simplifies each change into a short, practical explanation so you can understand and apply it without second-guessing.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Plain English Explanations</h3>
                  <p className="text-gray-600 dark:text-gray-300">No more deciphering complex regulatory language</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Quick Implementation</h3>
                  <p className="text-gray-600 dark:text-gray-300">Actionable steps to apply changes immediately</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">CPA-Reviewed Content</h3>
                  <p className="text-gray-600 dark:text-gray-300">Every summary is written and reviewed by certified professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Styled update summary card */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-md w-full">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white">ASC 326 Update</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current Expected Credit Loss</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">New</span>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">What Changed:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">FASB clarified how to estimate credit losses for financial instruments with embedded features.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Impact:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Medium - Affects companies with complex financial instruments</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Action Required:</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Review credit loss methodologies by Q2 2025</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Effective: Jan 1, 2025</span>
                    <span>Read time: 3 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
