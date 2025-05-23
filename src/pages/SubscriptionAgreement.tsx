import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Button } from "@/components/ui/button";
import { FileText, Download, List } from "lucide-react";
import { format } from "date-fns";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

export default function SubscriptionAgreement() {
  const today = format(new Date(), "MMMM d, yyyy");
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  
  const sections = [
    { id: "definitions", title: "1. Definitions" },
    { id: "access-use", title: "2. Access & Use Rights" },
    { id: "customer-responsibilities", title: "3. Customer Responsibilities" },
    { id: "fees", title: "4. Fees, Billing & Taxes" },
    { id: "term", title: "5. Term & Termination" },
    { id: "ip", title: "6. Intellectual Property" },
    { id: "confidentiality", title: "7. Confidentiality" },
    { id: "warranties", title: "8. Warranties & Disclaimers" },
    { id: "liability", title: "9. Limitation of Liability" },
    { id: "indemnification", title: "10. Indemnification" },
    { id: "compliance", title: "11. Compliance, Security & Data Processing" },
    { id: "dispute", title: "12. Dispute Resolution & Governing Law" },
    { id: "general", title: "13. General Provisions" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  const generatePDF = async () => {
    if (!contentRef.current) return;
    
    setGenerating(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we generate your PDF...",
    });
    
    try {
      // Get the content div that contains the entire agreement
      const content = contentRef.current;
      
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true,
      });
      
      // Calculate the dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Set margins (72 points = 1 inch)
      const margin = 72;
      const contentWidth = pdfWidth - (margin * 2);
      
      // Get the total height of the content
      const contentHeight = content.offsetHeight;
      
      // Scale factor to fit content width to PDF width (accounting for margins)
      const scale = contentWidth / content.offsetWidth;
      
      // Calculate number of pages needed
      const totalPages = Math.ceil(contentHeight * scale / (pdfHeight - (margin * 2)));
      
      let currentPosition = 0;
      
      // Function to add a page to the PDF
      const addPage = async (position: number, pageNum: number) => {
        // Set the clip area for html2canvas
        const canvas = await html2canvas(content, {
          scale: 2, // Higher scale for better quality
          y: position,
          height: Math.min((pdfHeight - (margin * 2)) / scale, contentHeight - position),
          useCORS: true,
          logging: false,
          windowHeight: contentHeight,
        });
        
        // Convert canvas to image
        const imgData = canvas.toDataURL('image/png');
        
        // Add image to PDF
        if (position > 0) {
          pdf.addPage();
        }
        
        // Add image with margins
        pdf.addImage(
          imgData, 
          'PNG', 
          margin, 
          margin, 
          contentWidth, 
          (canvas.height * contentWidth) / canvas.width
        );
        
        // Add footer
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        
        // Page number (center)
        pdf.text(`Page ${pageNum} of ${totalPages}`, pdfWidth / 2, pdfHeight - 30, { align: 'center' });
        
        // Website URL (right)
        pdf.text('https://gaapio.com', pdfWidth - margin, pdfHeight - 30, { align: 'right' });
        
        // Company name (left)
        pdf.text('Gaapio', margin, pdfHeight - 30, { align: 'left' });
      };
      
      // Process each page
      for (let i = 0; i < totalPages; i++) {
        await addPage(currentPosition, i + 1);
        currentPosition += (pdfHeight - (margin * 2)) / scale;
      }
      
      // Add custom styling for PDF
      pdf.setProperties({
        title: 'Gaapio Subscription Agreement',
        subject: 'Subscription Agreement',
        author: 'Gaapio',
        keywords: 'gaapio, subscription, agreement',
        creator: 'Gaapio'
      });
      
      // Save the PDF
      pdf.save('Gaapio_Subscription_Agreement.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your subscription agreement has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Generating PDF",
        description: "An error occurred while generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28" id="ssa-content">
        <ResponsiveContainer className="max-w-4xl my-8">
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm mb-8">
            {/* Updated print-specific styles with better page break handling */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                @page {
                  size: letter;
                  margin: 1in;
                }
                body {
                  font-size: 12pt;
                  line-height: 1.5;
                  color: #000;
                  background: #fff;
                }
                /* Enhanced page break handling */
                h1, h2, h3, h4, h5, h6 {
                  page-break-after: avoid;
                  page-break-inside: avoid;
                }
                ul, ol, dl {
                  page-break-before: avoid;
                }
                li, dd, dt {
                  page-break-inside: avoid;
                }
                p, ul, ol, dl {
                  orphans: 3;
                  widows: 3;
                }
                /* Keep sections together */
                .section-container {
                  break-inside: avoid-page;
                  page-break-inside: avoid;
                  page-break-before: auto;
                  page-break-after: auto;
                  margin-bottom: 20pt;
                }
                .subsection {
                  break-inside: avoid-page;
                  page-break-inside: avoid;
                }
                /* Make sure headers don't separate from their content */
                h2.section-header {
                  page-break-after: avoid;
                  break-after: avoid;
                  font-size: 14pt;
                  font-weight: bold;
                  margin-top: 20pt;
                  margin-bottom: 10pt;
                }
                h3.subsection-header {
                  page-break-after: avoid;
                  break-after: avoid;
                  font-size: 12pt;
                  font-weight: bold;
                  margin-top: 16pt;
                  margin-bottom: 8pt;
                }
                /* Fix bullet formatting */
                ul, ol {
                  margin-left: 0;
                  padding-left: 1.5em;
                }
                li {
                  margin-bottom: 6pt;
                }
                /* Hide elements that shouldn't be printed */
                button, .no-print {
                  display: none !important;
                }
                /* Ensure proper spacing between sections */
                section {
                  margin-bottom: 16pt;
                }
                /* Ensure full width */
                .print-container {
                  width: 100% !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
              }
            `}} />
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">GAAPIO SOFTWARE SUBSCRIPTION AGREEMENT</h1>
              <p className="text-muted-foreground mb-6">
                Last Updated: {today}
              </p>
              <div className="flex justify-center space-x-4 mb-8">
                <Button 
                  onClick={generatePDF} 
                  disabled={generating}
                  className="flex items-center gap-2 no-print"
                  variant="outline"
                >
                  <Download className="h-4 w-4" /> 
                  {generating ? "Generating..." : "Download PDF"}
                </Button>
                <Button 
                  onClick={() => document.getElementById("toc")?.scrollIntoView({ behavior: "smooth" })}
                  className="flex items-center gap-2 no-print"
                  variant="secondary"
                >
                  <List className="h-4 w-4" /> 
                  Table of Contents
                </Button>
              </div>
              <p className="text-muted-foreground">
                This document outlines the terms and conditions governing the use of Gaapio services.
              </p>
            </div>
            
            <div className="mb-10 border border-border rounded-lg p-6 bg-muted/20 no-print" id="toc">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Table of Contents
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-left"
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.title}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 print-container" ref={contentRef}>
              <p className="mb-8">
                This Subscription Services Agreement ("Agreement") is entered into by and between Gaapio, Inc., 
                a Delaware corporation ("Gaapio"), and the subscribing entity identified in an executed ordering 
                document that references this Agreement ("Customer"). This Agreement governs Customer's access to 
                and use of Gaapio's artificial intelligence-based software-as-a-service platform and related offerings.
              </p>
              
              <section className="mb-10 section-container" id="definitions">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">1. DEFINITIONS</h2>
                <div>
                  <p className="mb-3">
                    "AI Services" means Gaapio's proprietary AI-powered platform for automating accounting memo 
                    generation and related analysis, including all features, tools, modules, and enhancements 
                    ordered by Customer.
                  </p>
                  <p className="mb-3">
                    "Customer Content" means all data, documentation, text, or inputs uploaded by Customer or its 
                    Users to the AI Services or otherwise transmitted for processing.
                  </p>
                  <p className="mb-3">
                    "Deliverables" means output, reports, and other materials generated through Customer's use of the AI Services.
                  </p>
                  <p className="mb-3">
                    "Order Form" means any order form, quote, or online purchasing flow executed by the parties that 
                    references this Agreement and specifies the services to be delivered.
                  </p>
                  <p className="mb-3">
                    "Documentation" means user instructions, product information, and explanatory materials provided 
                    by Gaapio related to the use of the AI Services.
                  </p>
                  <p className="mb-3">
                    "Professional Services" means implementation, configuration, and consulting services performed by 
                    Gaapio, as specified in an Order Form or statement of work ("SOW").
                  </p>
                  <p className="mb-3">
                    "Subscription Term" means the duration of Customer's subscription to the AI Services, as set forth 
                    in the applicable Order Form.
                  </p>
                  <p className="mb-3">
                    "Users" means individuals authorized by Customer to access and use the AI Services.
                  </p>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="access-use">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">2. ACCESS & USE RIGHTS</h2>
                <div>
                  <p className="mb-3">
                    Subject to the terms of this Agreement, Gaapio grants Customer a limited, non-exclusive, 
                    non-transferable right to access and use the AI Services and Deliverables during the Subscription 
                    Term solely for Customer's internal business operations. All rights not expressly granted are 
                    reserved by Gaapio.
                  </p>
                  <p className="mb-3">
                    Customer may use Deliverables for its internal business and regulatory reporting purposes, including 
                    financial statements and SEC filings.
                  </p>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="customer-responsibilities">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">3. CUSTOMER RESPONSIBILITIES</h2>
                <div>
                  <p className="mb-3">Customer is responsible for:</p>
                  <ul className="list-disc pl-8 mb-6 space-y-2">
                    <li>Maintaining the confidentiality of login credentials and restricting access to authorized Users.</li>
                    <li>Ensuring its use of the AI Services complies with applicable laws and this Agreement.</li>
                    <li>The accuracy, quality, and legality of Customer Content.</li>
                  </ul>
                  <p className="mb-3">Customer shall not:</p>
                  <ul className="list-disc pl-8 space-y-2">
                    <li>Use the Services to infringe intellectual property rights or engage in illegal activities.</li>
                    <li>Decompile, reverse engineer, or create derivative works from the AI Services.</li>
                    <li>Use the AI Services to develop competing offerings.</li>
                  </ul>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="fees">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">4. FEES, BILLING & TAXES</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">4.1 Fees and Payment</h3>
                    <p className="mb-3">
                      All fees are due in accordance with the Order Form and payable within 30 days of invoice unless 
                      otherwise specified. Late payments may incur a monthly interest charge of 1.5%.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">4.2 Usage-Based Adjustments</h3>
                    <p className="mb-3">
                      If Customer exceeds usage volumes specified in the Order Form, Gaapio may invoice for the excess 
                      usage at the rates stated in the Order Form or Gaapio's then-current pricing.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">4.3 Taxes</h3>
                    <p className="mb-3">
                      Fees are exclusive of all applicable taxes. Customer shall be responsible for payment of all taxes 
                      except those based on Gaapio's income.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="term">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">5. TERM & TERMINATION</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">5.1 Term</h3>
                    <p className="mb-3">
                      This Agreement shall remain in effect for the duration of all active Subscription Terms unless 
                      earlier terminated. Unless otherwise specified in the Order Form, each Subscription Term shall 
                      automatically renew for successive periods equal to the initial term unless either party provides 
                      written notice of non-renewal at least 30 days prior to the end of the then-current term.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">5.2 Termination</h3>
                    <div>
                      <p className="mb-3">Either party may terminate this Agreement:</p>
                      <ul className="list-disc pl-8 mb-3 space-y-2">
                        <li>With written notice of non-renewal delivered at least 30 days before the end of a Subscription Term;</li>
                        <li>For material breach not cured within 30 days of written notice (or 14 days in the case of payment defaults);</li>
                        <li>Immediately upon the other party's insolvency or bankruptcy.</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">5.3 Effect of Termination</h3>
                    <div>
                      <p className="mb-3">Upon termination:</p>
                      <ul className="list-disc pl-8 space-y-2">
                        <li>All access rights are revoked;</li>
                        <li>Customer must cease all use of the AI Services;</li>
                        <li>Gaapio may delete Customer Content and Deliverables thirty (30) days after termination.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="ip">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">6. INTELLECTUAL PROPERTY</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">6.1 Ownership</h3>
                    <p className="mb-3">
                      Customer retains ownership of Customer Content. Gaapio retains ownership of the AI Services, 
                      platform, and any improvements or feedback provided.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">6.2 License to Data</h3>
                    <p className="mb-3">
                      Customer grants Gaapio a limited license to use Customer Content for the purpose of providing 
                      the AI Services.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">6.3 Usage Data and Improvements</h3>
                    <p className="mb-3">
                      Gaapio may use aggregated, de-identified usage data to improve the AI Services.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="confidentiality">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">7. CONFIDENTIALITY</h2>
                <p className="mb-3">
                  Each party agrees to maintain in confidence any non-public information received from the other 
                  party that is designated as confidential or that reasonably should be understood to be confidential. 
                  Confidentiality obligations shall survive for five (5) years after termination of this Agreement.
                </p>
              </section>
              
              <section className="mb-10 section-container" id="warranties">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">8. WARRANTIES & DISCLAIMERS</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">8.1 Limited Warranty</h3>
                    <p className="mb-3">
                      Gaapio warrants that the AI Services will materially conform to the applicable Documentation 
                      during the Subscription Term.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">8.2 Disclaimers</h3>
                    <p className="mb-3 uppercase">
                      Except as expressly provided, Gaapio disclaims all other warranties, including implied 
                      warranties of merchantability, fitness for a particular purpose, and non-infringement. 
                      The AI Services are provided "as is."
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">8.3 Outputs and Reliance</h3>
                    <p className="mb-3">
                      Deliverables generated by the AI Services are for informational purposes only. They are not 
                      intended to constitute accounting or legal advice, and Customer is solely responsible for 
                      verifying accuracy and compliance.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="liability">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">9. LIMITATION OF LIABILITY</h2>
                <p className="uppercase mb-3">
                  In no event shall either party be liable for indirect, incidental, or consequential damages. 
                  Gaapio's aggregate liability shall not exceed the amounts paid by Customer in the twelve (12) 
                  months preceding the claim.
                </p>
              </section>
              
              <section className="mb-10 section-container" id="indemnification">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">10. INDEMNIFICATION</h2>
                <p className="mb-3">
                  Each party agrees to indemnify, defend, and hold the other party harmless from third-party claims 
                  arising from breach of this Agreement, violation of applicable law, or infringement caused by 
                  materials provided by the indemnifying party, subject to prompt notice and control over defense.
                </p>
              </section>
              
              <section className="mb-10 section-container" id="compliance">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">11. COMPLIANCE, SECURITY, & DATA PROCESSING</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">11.1 Data Security</h3>
                    <p className="mb-3">
                      Gaapio implements industry-standard technical and organizational safeguards to protect Customer Content.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">11.2 Data Processing</h3>
                    <p className="mb-3">
                      If required by applicable law (e.g., GDPR or CCPA), the parties will execute a separate Data 
                      Processing Addendum.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">11.3 Export Compliance</h3>
                    <p className="mb-3">
                      Customer shall not use the AI Services in violation of U.S. export laws or regulations.
                    </p>
                  </div>
                </div>
              </section>
              
              <section className="mb-10 section-container" id="dispute">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">12. DISPUTE RESOLUTION & GOVERNING LAW</h2>
                <p className="mb-3">
                  This Agreement is governed by the laws of Delaware without regard to conflict of laws. Any dispute 
                  shall be resolved by binding arbitration under the Commercial Rules of the American Arbitration 
                  Association in Delaware. The prevailing party shall be entitled to reasonable legal fees.
                </p>
              </section>
              
              <section className="mb-10 section-container" id="general">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">13. GENERAL PROVISIONS</h2>
                
                <div>
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.1 Entire Agreement</h3>
                    <p className="mb-3">
                      This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.2 Assignment</h3>
                    <p className="mb-3">
                      Neither party may assign this Agreement without written consent, except to a successor entity.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.3 Force Majeure</h3>
                    <p className="mb-3">
                      Neither party shall be liable for delays due to causes beyond their reasonable control.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.4 Counterparts</h3>
                    <p className="mb-3">
                      This Agreement may be executed in counterparts, including electronically.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.5 No Legal Advice</h3>
                    <p className="mb-3">
                      Gaapio is not a licensed CPA firm and does not offer legal, tax, or accounting advice.
                    </p>
                  </div>
                  
                  <div className="subsection">
                    <h3 className="text-lg font-semibold mb-3 subsection-header">13.6 Publicity Rights</h3>
                    <p className="mb-3">
                      Customer grants Gaapio the right to include Customer's name and logo in its public client list, 
                      case studies, and marketing materials, unless otherwise agreed in writing.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}
