
import { CheckCircle, FileText, Clock, ArrowDown } from "lucide-react";

export function GuidanceMakesSenseSection() {
  return (
    <section className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Guidance That Makes Sense
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Most updates are filled with legal jargon. Gaapio simplifies each change into a short, practical explanation so you can understand and apply it without second-guessing.
          </p>
        </div>

        {/* Three-column benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Plain English Explanations</h3>
            <p className="text-gray-600 dark:text-gray-300">No more deciphering complex regulatory language</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Implementation</h3>
            <p className="text-gray-600 dark:text-gray-300">Actionable steps to apply changes immediately</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">CPA-Reviewed Content</h3>
            <p className="text-gray-600 dark:text-gray-300">Every summary is written and reviewed by certified professionals</p>
          </div>
        </div>

        {/* Arrow pointing down */}
        <div className="flex justify-center mb-12">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <ArrowDown className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        {/* Example card centered */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 max-w-2xl w-full relative">
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">New</span>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white">ASC 326 Update</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Expected Credit Loss</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </section>
  );
}
