
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { FileText, FileCheck, Download, Clock, CheckCircle2, Shield, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function OnePager() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hostname, setHostname] = useState("");
  
  useEffect(() => {
    setHostname(window.location.origin);
  }, []);
  
  const downloadAsPdf = async () => {
    if (!contentRef.current) return;
    
    setIsGenerating(true);
    
    try {
      // Clone the content div to modify it for PDF
      const contentClone = contentRef.current.cloneNode(true) as HTMLElement;
      
      // Create a container for the clone
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '-9999px';
      container.appendChild(contentClone);
      document.body.appendChild(container);
      
      // Add QR code for PDF only
      const qrContainer = document.createElement('div');
      qrContainer.style.position = 'absolute';
      qrContainer.style.right = '20px';
      qrContainer.style.bottom = '20px';
      qrContainer.style.width = '100px';
      qrContainer.style.height = '100px';
      
      // Render QR code to canvas
      const qrCanvas = document.createElement('canvas');
      qrCanvas.width = 100;
      qrCanvas.height = 100;
      const qrContext = qrCanvas.getContext('2d');
      
      if (qrContext) {
        const img = new Image();
        img.src = `data:image/svg+xml;utf8,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' + 
          document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
            .outerHTML.replace('</foreignObject>', 
              '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">' + 
              new QRCodeSVG({
                value: hostname,
                size: 100,
                level: 'H'
              }).outerHTML + 
              '</div></foreignObject>'
            ) + 
          '</svg>'
        )}`;
        
        img.onload = async () => {
          qrContext.drawImage(img, 0, 0);
          qrContainer.appendChild(qrCanvas);
          contentClone.appendChild(qrContainer);
          
          // Create PDF
          const canvas = await html2canvas(contentClone, {
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width / 2, canvas.height / 2]
          });
          
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
          pdf.save('gaapio-one-pager.pdf');
          
          // Clean up
          document.body.removeChild(container);
          setIsGenerating(false);
        };
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-32">
        <div className="container px-4 md:px-6 py-12 md:py-16">
          <div ref={contentRef} className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Gaapio: AI-Powered Accounting Memos</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Generate audit-ready accounting memos in seconds with AI-powered accuracy and CPA approval
              </p>
            </div>
            
            {/* How It Works Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Guided Prompts</h3>
                  <p className="text-muted-foreground">
                    Answer a series of guided questions that ensure standards-compliant memos.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <FileCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI & CPA Review</h3>
                  <p className="text-muted-foreground">
                    Our AI reviews your draft and suggests improvements with optional CPA review.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Manage & Deliver</h3>
                  <p className="text-muted-foreground">
                    Track version history and download polished, audit-ready memos.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Key Benefits Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-center mb-8">Key Benefits</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Audit Ready</h3>
                  <p className="text-muted-foreground">
                    Structured documentation that satisfies auditor requirements including version history and review notes.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border border-border">
                  <Clock className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Time & Cost Savings</h3>
                  <p className="text-muted-foreground">
                    Cut memo creation time by up to 90%, saving thousands compared to outsourced memos.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border border-border">
                  <FileText className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">CPA-Level Output</h3>
                  <p className="text-muted-foreground">
                    AI-generated memos that match or exceed the quality of experienced CPAs.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg border border-border">
                  <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Enterprise-Grade Security</h3>
                  <p className="text-muted-foreground">
                    Your data stays private with strict security protocols to maintain full confidentiality.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <Button size="lg" variant="default" onClick={downloadAsPdf} disabled={isGenerating}>
                {isGenerating ? "Generating PDF..." : "Download One-Pager"}
                <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
