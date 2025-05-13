
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  FileText, 
  Check, 
  Clock, 
  ShieldCheck, 
  CheckCircle2
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
          <div className="mb-4 w-full max-w-5xl">
            <Button 
              onClick={downloadAsPdf} 
              variant="blue"
              className="print:hidden"
            >
              <Download className="mr-2 h-4 w-4" /> Download One-Pager
            </Button>
          </div>
          
          {/* The one-pager content that will be captured for PDF */}
          <div 
            ref={downloadAreaRef} 
            className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-5xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {/* Header area with logo */}
            <div className="p-8 pb-0">
              <div className="flex justify-between items-start">
                <img 
                  src="/lovable-uploads/b61a102c-0c33-49dc-b64f-3147395ff740.png" 
                  alt="Gaapio Logo" 
                  className="w-32 h-auto" 
                />
              </div>
            </div>

            {/* Hero Section - Updated layout */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Headline - Left side */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1F2C] mb-4">
                    Fastest way to create<br />audit-ready accounting memos
                  </h1>
                  <p className="text-base md:text-lg text-gray-700 mb-6 max-w-xl">
                    Gaapio is the AI assistant built for accounting teams. From ASC 606 memos to 10-K footnotes, 
                    we help your team move faster while staying GAAP-compliant.
                  </p>
                  
                  {/* Core offerings highlight */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
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
                
                {/* Professional Image - Right side */}
                <div className="md:w-2/5">
                  <div className="rounded-lg overflow-hidden shadow-md">
                    <AspectRatio ratio={4/3} className="bg-muted">
                      <img 
                        src="/lovable-uploads/c45fd480-1870-4963-9797-c53223261a19.png" 
                        alt="Finance Team Working" 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="h-px bg-gray-100 mx-8" />
            
            {/* Key Capabilities Section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0074d4] mb-6">Key Gaapio Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <ul className="space-y-3">
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
                <div className="space-y-4">
                  <ul className="space-y-3">
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
            
            {/* How It Works section with visual */}
            <div className="bg-gray-50 p-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
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
                
                {/* How it works content */}
                <div className="md:w-1/2 space-y-6">
                  <h2 className="text-2xl font-bold text-[#0074d4]">How Gaapio Works</h2>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">1</div>
                      Draft
                    </h3>
                    <p className="text-gray-600 pl-8">Input your accounting scenario through guided prompts. Our AI drafts a compliant memo in seconds.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">2</div>
                      Review
                    </h3>
                    <p className="text-gray-600 pl-8">Our system checks for GAAP compliance. Team members can comment and suggest edits in real-time.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-800 flex items-center">
                      <div className="bg-[#0074d4] text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">3</div>
                      Approve & Deliver
                    </h3>
                    <p className="text-gray-600 pl-8">Finalize with approval workflows. Export audit-ready documents with full citation support.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Benefits grid section */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0074d4] mb-6">Benefits That Matter</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Benefit box 1 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <Clock className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Cut memo creation time by 80%</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Automate routine disclosure drafting</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Focus on analysis, not formatting</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 2 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <ShieldCheck className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Ensure Compliance</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Up-to-date with latest standards</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Built-in GAAP/IFRS references</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Audit trail for review process</span>
                    </li>
                  </ul>
                </div>
                
                {/* Benefit box 3 */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                  <div className="p-2 rounded-full bg-[#0074d4]/10 inline-flex mb-3">
                    <FileText className="h-5 w-5 text-[#0074d4]" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Improve Quality</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Consistent structure and language</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Enhanced clarity for reviewers</span>
                    </li>
                    <li className="flex items-start">
                      <div className="p-0.5 rounded-full bg-[#0074d4]/10 mt-1 mr-2">
                        <Check className="h-3 w-3 text-[#0074d4]" />
                      </div>
                      <span>Reduced errors and omissions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* CTA section */}
            <div className="bg-[#0074d4] text-white p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">See how Gaapio automates your next memo</h2>
              <p className="mb-6 max-w-2xl mx-auto">Book a demo today at www.gaapio.com/demo</p>
              
              {/* Download button container - this will be hidden in PDF */}
              <div className="download-button-container">
                <Button 
                  onClick={downloadAsPdf} 
                  variant="outline"
                  size="lg"
                  className="mx-auto text-white border-white hover:bg-white/10"
                >
                  <Download className="mr-2 h-4 w-4" /> Download One-Pager
                </Button>
              </div>
            </div>
            
            {/* Footer with contact info */}
            <div className="p-4 text-center bg-gray-50 border-t text-sm text-gray-600">
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
