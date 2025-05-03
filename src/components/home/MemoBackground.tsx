
import { Review } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";

interface MemoBackgroundProps {
  isDark: boolean;
}

export const MemoBackground = memo(function MemoBackground({ isDark }: MemoBackgroundProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      <div 
        className={`relative w-[80%] max-w-5xl mx-auto ${isDark ? 'text-white/90' : 'text-black/80'}`}
        style={{
          transform: 'rotate(-5deg) translateX(15%) translateY(20%)',
        }}
      >
        {/* Memo Container */}
        <div 
          className={`
            relative rounded-md w-full aspect-[1.4/1] 
            ${isDark ? 'bg-gray-900/70 border border-gray-700/50' : 'bg-white/80 border border-gray-200/70'} 
            shadow-lg backdrop-blur-sm
          `}
        >
          {/* Tabs Section */}
          <div className="absolute top-4 left-4 right-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className={`
                w-full max-w-md h-10 border border-r-0 border-b-0 
                ${isDark ? 'bg-gray-800/80 border-gray-700/60' : 'bg-gray-50/90 border-gray-200/60'}
              `}>
                <TabsTrigger value="overview" className="text-sm data-[state=active]:bg-transparent">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="review" className="text-sm data-[state=active]:bg-transparent">
                  Review
                </TabsTrigger>
                <TabsTrigger value="history" className="text-sm data-[state=active]:bg-transparent">
                  History
                </TabsTrigger>
                <div className="flex items-center justify-center px-4">
                  <Review size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Title Section */}
          <div className="absolute top-24 left-8 right-8">
            <h3 className={`text-4xl font-bold tracking-tight ${isDark ? 'text-white/90' : 'text-gray-800/90'}`}>
              ASC 606 ACCOUNTING MEMO
            </h3>
            
            {/* Section 1: Background */}
            <div className="mt-12">
              <h4 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white/90' : 'text-gray-800/90'}`}>
                1. Background
              </h4>
              
              {/* Simulated paragraph text lines */}
              <div className={`h-2 w-full rounded-full mb-3 ${isDark ? 'bg-gray-600/40' : 'bg-gray-300/60'}`}></div>
              <div className={`h-2 w-[85%] rounded-full ${isDark ? 'bg-gray-600/40' : 'bg-gray-300/60'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
