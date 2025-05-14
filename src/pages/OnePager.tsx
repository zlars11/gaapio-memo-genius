
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Check, 
  Clock, 
  ShieldCheck, 
  FileSearch,
  FileCheck,
  FileCode  // Changed from FileScope to FileCode as suggested by the error
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
      
      <main className="py-10">
        <div className="container px-4 md:px-6 flex flex-col items-center">
          {/* Download button at the top */}
          <div className="mb-6 w-full max-w-4xl">
            <Button 
              onClick={downloadAsPdf} 
              variant="blue"
              className="print:hidden"
            >
              <Download className="mr-2 h-4 w-4" /> Download One-Pager
            </Button>
          </div>
          
          {/* The one-pager content - optimized for PDF export */}
          <div 
            ref={downloadAreaRef} 
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl"
            style={{ 
              fontFamily: 'Inter var, sans-serif',
            }}
          >
            {/* Header area with larger logo */}
            <div className="p-6 pb-4">
              <div className="flex justify-between items-start">
                <img 
                  src="/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png" 
                  alt="Gaapio Logo" 
                  className="w-48 h-auto" // Increased size from w-40
                />
              </div>
            </div>

            {/* Hero Section - Modern layout with professional image */}
            <div className="p-6 bg-gradient-to-b from-slate-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Left side: Value proposition */}
                <div className="space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1F2C] leading-tight">
                    Fastest way to create<br />audit-ready accounting memos
                  </h1>
                  <p className="text-base text-gray-700 max-w-lg">
                    Gaapio is the AI assistant built for accounting teams. From ASC 606 memos to 10-K footnotes, 
                    we help your team move faster while staying GAAP-compliant.
                  </p>
                  
                  {/* Core offerings highlight */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-full bg-[#0074d4]/10">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2 font-medium">Technical Accounting Memos</span>
                    </div>
                    <div className="flex items-center">
                      <div className="p-1.5 rounded-full bg-[#0074d4]/10">
                        <Check className="h-4 w-4 text-[#0074d4]" />
                      </div>
                      <span className="ml-2 font-medium">Footnote Disclosures</span>
                    </div>
                  </div>
                </div>
                
                {/* Right side: Professional image */}
                <div>
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <AspectRatio ratio={4/3}>
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
            
            <Separator className="h-px bg-gray-100 mx-6" />
            
            {/* Key Capabilities Section */}
            <div className="p-6 bg-slate-50/70">
              <h2 className="text-xl md:text-2xl font-bold text-[#0074d4] mb-4">Key Gaapio Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First column */}
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">AI-powered memo drafting</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Real-time compliance checks</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Built-in GAAP/IFRS citations</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Team collaboration features</span>
                  </div>
                </div>
                
                {/* Second column */}
                <div className="space-y-2.5">
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Footnote generation</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Version history and audit trail</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Customizable templates</span>
                  </div>
                  <div className="flex items-start">
                    <div className="p-1.5 rounded-full bg-[#0074d4]/10 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-[#0074d4]" />
                    </div>
                    <span className="ml-2 text-sm">Optional CPA review</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* How It Works section with modern UI mockup */}
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Image/screenshot - takes 2/5 of the grid */}
                <div className="md:col-span-2">
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                    <AspectRatio ratio={4/3}>
                      <img 
                        src="/lovable-uploads/87623a0a-f991-495f-9403-a577f9e5ee2a.png" 
                        alt="Gaapio Interface" 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
                
                {/* How it works content with icons - takes 3/5 of the grid */}
                <div className="md:col-span-3 space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-[#0074d4] mb-2">How Gaapio Works</h2>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-[#0074d4]/10 mr-4 mt-1">
                      <FileSearch className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">1. Draft</h3>
                      <p className="text-sm text-gray-600">Input your accounting scenario through guided prompts. Our AI drafts a compliant memo in seconds.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-[#0074d4]/10 mr-4 mt-1">
                      <FileCheck className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">2. Review</h3>
                      <p className="text-sm text-gray-600">Our system checks for GAAP compliance. Team members can comment and suggest edits in real-time.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-full bg-[#0074d4]/10 mr-4 mt-1">
                      <FileText className="h-5 w-5 text-[#0074d4]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">3. Approve & Deliver</h3>
                      <p className="text-sm text-gray-600">Finalize with approval workflows. Export audit-ready documents with full citation support.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefits grid section with modern layout */}
            <div className="p-6 bg-gradient-to-b from-slate-50 to-white">
              <h2 className="text-xl md:text-2xl font-bold text-[#0074d4] mb-4">Benefits That Matter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Benefit box 1 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <Clock className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Cut memo creation time by 80%</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Automate routine disclosure drafting</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 2 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <ShieldCheck className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ensure Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Up-to-date with latest standards</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Built-in GAAP/IFRS references</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 3 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <FileText className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Improve Quality</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Consistent structure and language</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-1 rounded-full bg-[#0074d4]/10 mt-0.5 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Enhanced clarity for reviewers</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* CTA section with enhanced typography */}
            <div className="bg-[#0074d4] text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">See how Gaapio automates your next memo</h2>
              <p className="mb-6 max-w-2xl mx-auto text-xl">Book a demo today</p>
              
              {/* Download button container - this will be hidden in PDF */}
              <div className="download-button-container">
                <Button 
                  variant="outline"
                  size="lg"
                  className="mx-auto text-white border-white hover:bg-white/20 text-lg px-8 py-2.5"
                >
                  www.gaapio.com/demo
                </Button>
              </div>
            </div>
            
            {/* Footer with contact info */}
            <div className="p-4 text-center bg-gray-50 border-t text-sm text-gray-600">
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div className="flex items-center">
                  <span className="text-[#0074d4] mr-1">🌐</span>
                  <span>www.gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4] mr-1">✉️</span>
                  <span>sales@gaapio.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-[#0074d4] mr-1">✉️</span>
                  <span>info@gaapio.com</span>
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
