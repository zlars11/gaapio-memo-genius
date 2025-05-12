
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Check, Zap, Clock, ShieldCheck, BarChart2, Lightbulb, Building2, Brain } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
      
      <main className="pt-20 pb-16">
        <div className="container px-4 md:px-6 flex flex-col items-center">
          {/* Download button at the top */}
          <div className="mb-8 w-full max-w-4xl">
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
          >
            {/* Hero Section - Horizontal layout */}
            <div className="p-8 md:p-12 border-b">
              <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                {/* Logo and Headline */}
                <div className="flex-1">
                  <img 
                    src="/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png" 
                    alt="Gaapio Logo" 
                    className="w-16 h-16 mb-6"
                  />
                  <h1 className="text-3xl font-bold tracking-tight mb-4">
                    Accounting memos and footnote disclosures — automated, accurate, and audit-ready.
                  </h1>
                  <p className="text-lg text-gray-700">
                    Gaapio is the AI assistant built for accounting teams. From ASC 606 memos to 10-K footnotes, 
                    we help your team move faster while staying GAAP-compliant.
                  </p>
                </div>
                
                {/* Professional Image */}
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
            
            {/* What Gaapio Automates - Two columns */}
            <div className="p-8 md:p-12 bg-gray-50">
              <h2 className="text-2xl font-semibold mb-8 text-[#0074d4]">What Gaapio Automates</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Technical Accounting Memos */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#0074d4]/10 p-3 rounded-full mr-3">
                      <FileText className="h-6 w-6 text-[#0074d4]" />
                    </div>
                    <h3 className="text-xl font-medium">Technical Accounting Memos</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Revenue recognition memos (ASC 606)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Lease accounting (ASC 842)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Complex capitalization policies</span>
                    </li>
                  </ul>
                </div>
                
                {/* Footnote Disclosures */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#0074d4]/10 p-3 rounded-full mr-3">
                      <BarChart2 className="h-6 w-6 text-[#0074d4]" />
                    </div>
                    <h3 className="text-xl font-medium">Footnote Disclosures</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Income tax disclosures (ASC 740)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Revenue, leases, segment reporting</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-[#0074d4] mr-2 flex-shrink-0 mt-0.5" />
                      <span>Filing-ready 10-K / 10-Q footnotes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Streamlined Workflow - Left bullets, Right image */}
            <div className="p-8 md:p-12 border-t border-b">
              <h2 className="text-2xl font-semibold mb-8 text-[#0074d4]">Streamlined Workflow</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left Column Bullets */}
                <div className="md:w-1/2 space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#0074d4]/10 p-2 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Guided drafting for accuracy and compliance</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Step-by-step workflow ensures all critical elements are addressed
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#0074d4]/10 p-2 rounded-full mr-3 flex-shrink-0">
                      <Brain className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Proprietary AI reviewed by CPAs</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Trained on thousands of accounting memos and footnotes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#0074d4]/10 p-2 rounded-full mr-3 flex-shrink-0">
                      <FileText className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h4 className="font-medium">Built-in ASC references & templates</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Cites relevant guidance for maximum audit defensibility
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column Image */}
                <div className="md:w-1/2">
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md">
                    <img 
                      src="/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png" 
                      alt="Gaapio Interface" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="p-4 bg-gray-50 text-center text-sm text-gray-600">
                      Example ASC 606 Memo Draft
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Gaapio Capabilities - Grid layout */}
            <div className="p-8 md:p-12 bg-gray-50">
              <h2 className="text-2xl font-semibold mb-8 text-[#0074d4]">Key Gaapio Capabilities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <Brain className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">AI trained by Big 4 CPAs</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <Check className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">Aligned to U.S. GAAP</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <Clock className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">Draft in minutes</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <Zap className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">No technical setup</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <ShieldCheck className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">SOC 2 Ready</h3>
                </div>
                
                <div className="flex flex-col items-center text-center p-4">
                  <div className="bg-[#0074d4]/10 p-3 rounded-full mb-3">
                    <Building2 className="h-6 w-6 text-[#0074d4]" />
                  </div>
                  <h3 className="font-medium mb-1">Built for controllers & CFOs</h3>
                </div>
              </div>
            </div>
            
            {/* Why Gaapio */}
            <div className="p-8 md:p-12">
              <h2 className="text-2xl font-semibold mb-6 text-[#0074d4] text-center">Why Gaapio?</h2>
              
              <div className="bg-[#0074d4]/5 p-6 rounded-lg border border-[#0074d4]/20 max-w-3xl mx-auto">
                <div className="flex items-start">
                  <Lightbulb className="h-6 w-6 text-[#0074d4] mr-4 flex-shrink-0 mt-1" />
                  <p className="text-lg">
                    We built Gaapio because writing memos and footnotes is painful — you're juggling ASC guidance, 
                    internal controls, and audit scrutiny, all under deadline pressure. Gaapio helps you move faster, 
                    stay compliant, and free up your team for more important work.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Footer with contact info */}
            <div className="bg-gray-50 p-8 text-center border-t">
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
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
