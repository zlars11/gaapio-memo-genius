
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Check, 
  Clock, 
  ShieldCheck, 
  CheckCircle2,
  FilePen,
  Search
} from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
      
      // PDF dimensions (8.5" x 11" in mm)
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
      
      <main className="py-12">
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
          
          {/* The one-pager content with reduced height to fit PDF */}
          <div 
            ref={downloadAreaRef} 
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl"
            style={{ 
              fontFamily: 'Inter var, sans-serif',
              maxHeight: '1056px', // 11 inches in pixels at 96 DPI
            }}
          >
            {/* Header area with larger logo */}
            <div className="p-6">
              <div className="flex justify-between items-start">
                <img 
                  src="/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png" 
                  alt="Gaapio Logo" 
                  className="w-40 h-auto" // Increased size from w-32
                />
              </div>
            </div>

            {/* Hero Section - Updated layout with accounting professionals image */}
            <div className="p-6 pb-2">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Headline - Left side */}
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#1A1F2C] mb-4">
                    Fastest way to create<br />audit-ready accounting memos
                  </h1>
                  <p className="text-base md:text-lg text-gray-700 mb-5 max-w-lg">
                    Gaapio is the AI assistant built for accounting teams. From ASC 606 memos to 10-K footnotes, 
                    we help your team move faster while staying GAAP-compliant.
                  </p>
                  
                  {/* Core offerings highlight */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-0">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-[#0074d4]/10">
                        <CheckCircle2 className="h-5 w-5 text-[#0074d4]" />
                      </div>
                      <span className="ml-2 font-medium">Technical Accounting Memos</span>
                    </div>
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-[#0074d4]/10">
                        <CheckCircle2 className="h-5 w-5 text-[#0074d4]" />
                      </div>
                      <span className="ml-2 font-medium">Footnote Disclosures</span>
                    </div>
                  </div>
                </div>
                
                {/* Professional Accounting Team Image - Right side */}
                <div className="md:w-2/5">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <AspectRatio ratio={4/3} className="bg-muted">
                      <img 
                        src="/lovable-uploads/c45fd480-1870-4963-9797-c53223261a19.png" 
                        alt="Accounting Team Collaboration" 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="h-px bg-gray-100 mx-6 my-3" />
            
            {/* Key Capabilities Section with subtle background */}
            <div className="p-6 bg-gray-50/70">
              <h2 className="text-xl md:text-2xl font-bold text-[#0074d4] mb-4">Key Gaapio Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">AI-powered memo drafting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Real-time compliance checks</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Built-in GAAP/IFRS citations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Team collaboration features</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Footnote generation</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Version history and audit trail</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Customizable templates</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-1">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2">Optional CPA review</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* How It Works section with visual and icons */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Image/screenshot */}
                <div className="md:w-1/2">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                    <AspectRatio ratio={16/10} className="bg-white">
                      <img 
                        src="/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png" 
                        alt="Gaapio Interface" 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
                
                {/* How it works content with icons */}
                <div className="md:w-1/2 space-y-5">
                  <h2 className="text-xl md:text-2xl font-bold text-[#0074d4]">How Gaapio Works</h2>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">1</div>
                      <FilePen className="h-4 w-4 text-[#0074d4] mr-1.5" />
                      Draft
                    </h3>
                    <p className="text-gray-600 pl-8 text-sm">Input your accounting scenario through guided prompts. Our AI drafts a compliant memo in seconds.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">2</div>
                      <Search className="h-4 w-4 text-[#0074d4] mr-1.5" />
                      Review
                    </h3>
                    <p className="text-gray-600 pl-8 text-sm">Our system checks for GAAP compliance. Team members can comment and suggest edits in real-time.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">3</div>
                      <Check className="h-4 w-4 text-[#0074d4] mr-1.5" />
                      Approve & Deliver
                    </h3>
                    <p className="text-gray-600 pl-8 text-sm">Finalize with approval workflows. Export audit-ready documents with full citation support.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefits grid section with light gradient background */}
            <div className="p-6 bg-gradient-to-b from-white to-gray-50">
              <h2 className="text-xl md:text-2xl font-bold text-[#0074d4] mb-4">Benefits That Matter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Benefit box 1 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                  <div className="p-1.5 rounded-full bg-[#0074d4]/10 inline-flex mb-2">
                    <Clock className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">Save Time</h3>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Cut memo creation time by 80%</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Automate routine disclosure drafting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Focus on analysis, not formatting</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 2 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                  <div className="p-1.5 rounded-full bg-[#0074d4]/10 inline-flex mb-2">
                    <ShieldCheck className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">Ensure Compliance</h3>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Up-to-date with latest standards</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Built-in GAAP/IFRS references</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Audit trail for review process</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 3 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                  <div className="p-1.5 rounded-full bg-[#0074d4]/10 inline-flex mb-2">
                    <FileText className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">Improve Quality</h3>
                  <ul className="space-y-1.5 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Consistent structure and language</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Enhanced clarity for reviewers</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-1.5">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Reduced errors and omissions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* CTA section with enhanced typography */}
            <div className="bg-[#0074d4] text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-3">See how Gaapio automates your next memo</h2>
              <p className="mb-5 max-w-2xl mx-auto text-lg">Book a demo today at <span className="font-semibold">www.gaapio.com/demo</span></p>
              
              {/* Download button container - this will be hidden in PDF */}
              <div className="download-button-container">
                <Button 
                  onClick={downloadAsPdf} 
                  variant="outline"
                  size="lg"
                  className="mx-auto text-white border-white hover:bg-white/20"
                >
                  <Download className="mr-2 h-4 w-4" /> Download One-Pager
                </Button>
              </div>
            </div>
            
            {/* Footer with contact info */}
            <div className="p-3 text-center bg-gray-50 border-t text-sm text-gray-600">
              <div className="flex flex-wrap justify-center items-center gap-4">
                <div className="flex items-center">
                  <span className="text-[#0074d4]">🌐</span>
                  <span className="ml-1">www.gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4]">✉️</span>
                  <span className="ml-1">sales@gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4]">✉️</span>
                  <span className="ml-1">info@gaapio.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
