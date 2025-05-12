
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Download, FileText, Check, Lightning } from "lucide-react";
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
              className="bg-[#339CFF] hover:bg-[#1F8FFF] text-white"
            >
              <Download className="mr-2 h-4 w-4" /> Download One-Pager
            </Button>
          </div>
          
          {/* The actual one-pager content that will be captured for PDF */}
          <div 
            ref={downloadAreaRef} 
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl"
          >
            <div className="p-8 md:p-12">
              {/* Logo and Heading */}
              <div className="flex items-center mb-8">
                <img 
                  src="/lovable-uploads/4f7e5119-fbb1-4267-a6e5-ca8016310188.png" 
                  alt="Gaapio Logo" 
                  className="w-16 h-16 mr-4"
                />
                <h1 className="text-3xl font-bold">gaapio</h1>
              </div>
              
              {/* Hero Section */}
              <div className="mb-12">
                <h2 className="text-4xl font-bold tracking-tight mb-4">
                  Accounting memos — automated, accurate, and audit-ready.
                </h2>
                <p className="text-lg text-gray-700">
                  Gaapio is the AI memo assistant for accounting teams. Built by CPAs, 
                  it drafts technical memos with precision, helping your team move faster 
                  while staying GAAP-compliant.
                </p>
              </div>
              
              {/* Streamlined Memo Creation */}
              <div className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-6">Streamlined Memo Creation</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-[#339CFF] text-white p-2 rounded mr-3 flex-shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Guided drafting for accuracy and compliance</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#339CFF] text-white p-2 rounded mr-3 flex-shrink-0">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Proprietary AI reviews and enhances</h4>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#339CFF] text-white p-2 rounded mr-3 flex-shrink-0">
                        <Lightning className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Built-in technical references</h4>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="text-center font-medium mb-2">Revenue Recognition Memo</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium">1. Background and Transaction Summary</div>
                        <div className="h-2 bg-gray-200 rounded w-full mt-1"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">2. Application Guidance</div>
                        <div className="h-2 bg-gray-200 rounded w-full mt-1"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">3. Rich in technical references</div>
                        <div className="h-2 bg-gray-200 rounded w-full mt-1"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">4. Actions and Uncertainties</div>
                        <div className="h-2 bg-gray-200 rounded w-full mt-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Key Capabilities */}
              <div className="mb-12">
                <h3 className="text-2xl font-semibold mb-6">Key Gaapio Capabilities</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="bg-[#339CFF] text-white p-1 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p>Advanced AI trained by Big 4 experts to tackle technical accounting with speed and reliability</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#339CFF] text-white p-1 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p>Built by CPAs for CPAs and accounting teams</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#339CFF] text-white p-1 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p>ASC-aligned technical content that keeps you GAAP compliant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#339CFF] text-white p-1 rounded-full mr-3 flex-shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p>Draft, edit, and finalize memos in a fraction of the time</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Why Gaapio */}
              <div className="mb-12 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Why Gaapio?</h3>
                <p className="text-lg">
                  We built Gaapio because writing memos sucks. You're juggling ASC guidance, 
                  internal policy, and audit risk — all under a deadline. Gaapio helps you 
                  move faster, stay compliant, and free up your team for more important work.
                </p>
              </div>
              
              {/* Contact Information */}
              <div className="border-t pt-6 mt-6 text-center">
                <div className="flex justify-around items-center">
                  <div>www.gaapio.com</div>
                  <div>sales@gaapio.com</div>
                  <div>info@gaapio.com</div>
                </div>
              </div>
              
              {/* Hidden container for the download button that won't appear in the PDF */}
              <div className="download-button-container flex justify-center mt-8">
                <Button 
                  onClick={downloadAsPdf} 
                  className="bg-[#339CFF] hover:bg-[#1F8FFF] text-white"
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
