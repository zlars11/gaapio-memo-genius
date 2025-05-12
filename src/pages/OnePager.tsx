
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Check, Zap, Clock, ShieldCheck, BarChart2, Lightbulb, Building2, Brain } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Separator } from "@/components/ui/separator";

export default function OnePager() {
  const contentRef = useRef<HTMLDivElement>(null);
  const downloadAreaRef = useRef<HTMLDivElement>(null);
  
  const downloadAsPdf = async () => {
    if (!downloadAreaRef.current) return;
    
    try {
      // Hide the download button before capturing
      const downloadButton = downloadAreaRef.current.querySelector('.download-button-container');
      if (downloadButton) {
        downloadButton.classList.add('hidden');
      }
      
      const canvas = await html2canvas(downloadAreaRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Restore the download button visibility
      if (downloadButton) {
        downloadButton.classList.remove('hidden');
      }
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate the ratio to fit the image properly on the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth * ratio, imgHeight * ratio);
      pdf.save('gaapio-one-pager.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background" ref={contentRef}>
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="container px-4 md:px-6 flex flex-col items-center">
          {/* Download button at the top */}
          <div className="mb-4 w-full max-w-4xl">
            <Button 
              onClick={downloadAsPdf} 
              variant="blue"
              className="print:hidden"
            >
              <Download className="mr-2 h-4 w-4" /> Download One-Pager
            </Button>
          </div>
          
          {/* The actual one-pager content that will be captured for PDF */}
          <div 
            ref={downloadAreaRef} 
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl"
            style={{ fontFamily: 'Inter, sans-serif', maxHeight: '1100px' }}
          >
            {/* Hero Section - Updated layout */}
            <div className="p-6 md:p-8 border-b">
              <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                {/* Logo and Headline - Left side */}
                <div className="flex-1">
                  <img 
                    src="/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png" 
                    alt="Gaapio Logo" 
                    className="w-24 h-auto mb-6" 
                  />
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                    Audit-Ready Memos and Disclosures
                  </h1>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-700 mb-3">
                    AI-Powered. CPA-Approved.
                  </h2>
                  <p className="text-base text-gray-700 mb-4">
                    Gaapio is the AI assistant built for accounting teams. From ASC 606 memos to 10-K footnotes, 
                    we help your team move faster while staying GAAP-compliant.
                  </p>
                  
                  {/* Callout bar for core offerings */}
                  <div className="bg-[#0074d4]/5 p-3 rounded-md border border-[#0074d4]/20 flex items-center justify-center mt-2 mb-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-[#0074d4] mr-2" />
                        <span className="font-medium">Technical Accounting Memos</span>
                      </div>
                      <div className="flex items-center">
                        <Check className="h-5 w-5 text-[#0074d4] mr-2" />
                        <span className="font-medium">Footnote Disclosures</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Image - Right side */}
                <div className="flex-shrink-0 md:w-2/5">
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src="/lovable-uploads/c45fd480-1870-4963-9797-c53223261a19.png" 
                      alt="Finance Team Working" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="h-px bg-gray-100" />
            
            {/* Streamlined Workflow - Adjusted layout */}
            <div className="p-5 md:p-6 border-b">
              <h2 className="text-xl font-semibold mb-4 text-[#0074d4]">Streamlined Workflow</h2>
              
              <div className="flex flex-col md:flex-row gap-5">
                {/* Left Column - Screenshot */}
                <div className="md:w-2/5">
                  <img 
                    src="/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png" 
                    alt="Gaapio Interface" 
                    className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    style={{ maxHeight: "200px", objectFit: "cover" }}
                  />
                </div>
                
                {/* Right Column - Steps */}
                <div className="md:w-3/5 space-y-3">
                  <div className="mb-2">
                    <h3 className="text-base font-semibold flex items-center">
                      <FileText className="h-4 w-4 text-[#0074d4] mr-2" />
                      Guided Prompts
                    </h3>
                    <ul className="ml-6 text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Built-in guardrails for accuracy</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Up-to-date with latest standards</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Drafted instantly by trained AI</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="text-base font-semibold flex items-center">
                      <FileText className="h-4 w-4 text-[#0074d4] mr-2" />
                      Review
                    </h3>
                    <ul className="ml-6 text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Proprietary AI reviews and gives suggestions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>One-click edits and enhancements</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Internal sign offs and audit trail</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Optional CPA review</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-semibold flex items-center">
                      <FileText className="h-4 w-4 text-[#0074d4] mr-2" />
                      Manage & Deliver
                    </h3>
                    <ul className="ml-6 text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Presentation-ready memos and disclosures</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Full version history and reviewer comments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0074d4] mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>Exportable audit reports</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="h-px bg-gray-100" />
            
            {/* Key Benefits Section - From homepage */}
            <div className="p-5 md:p-6 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4 text-[#0074d4]">Key Benefits</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
                <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 mb-2">
                    <CheckCircle className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium text-sm">Audit Ready</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 mb-2">
                    <Clock className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium text-sm">Time & Cost Savings</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 mb-2">
                    <FileText className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium text-sm">CPA-Level Output</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 mb-2">
                    <ShieldCheck className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium text-sm">GAAP/IFRS Compliance</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 mb-2">
                    <Shield className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium text-sm">Enterprise-Grade Security</h3>
                </div>
              </div>
            </div>
            
            <Separator className="h-px bg-gray-100" />
            
            {/* Footer with contact info - Kept as is */}
            <div className="bg-gray-50 p-6 text-center border-t">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
                <div className="flex items-center">
                  <span className="text-[#0074d4]">🌐</span>
                  <span className="ml-2">www.gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4]">✉️</span>
                  <span className="ml-2">sales@gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4]">✉️</span>
                  <span className="ml-2">info@gaapio.com</span>
                </div>
              </div>
              
              {/* Download button container - this will be hidden in PDF */}
              <div className="download-button-container">
                <Button 
                  onClick={downloadAsPdf} 
                  variant="blue"
                  size="lg"
                  className="mx-auto"
                >
                  <Download className="mr-2 h-4 w-4" /> Download One-Pager
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

