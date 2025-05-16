
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

export default function DPA() {
  const today = format(new Date(), "MMMM d, yyyy");
  const contentRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();
  
  const sections = [
    { id: "purpose", title: "1. Purpose & Scope" },
    { id: "roles", title: "2. Roles of the Parties" },
    { id: "types", title: "3. Types of Data and Data Subjects" },
    { id: "subprocessors", title: "4. Subprocessors" },
    { id: "security", title: "5. Security Measures" },
    { id: "rights", title: "6. Data Subject Rights" },
    { id: "transfers", title: "7. Data Transfers" },
    { id: "retention", title: "8. Retention and Deletion" },
    { id: "audit", title: "9. Audit Rights" },
    { id: "governing", title: "10. Governing Law" },
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
        title: 'Gaapio Data Processing Addendum',
        subject: 'Data Processing Addendum',
        author: 'Gaapio',
        keywords: 'gaapio, dpa, data processing',
        creator: 'Gaapio'
      });
      
      // Save the PDF
      pdf.save('Gaapio_Data_Processing_Addendum.pdf');
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your data processing addendum has been downloaded.",
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
      
      <main className="flex-1 pt-28" id="dpa-content">
        <ResponsiveContainer className="max-w-4xl my-8">
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm mb-8">
            {/* Add print-specific styles */}
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
                /* Prevent awkward page breaks */
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
                /* Fix bullet formatting */
                ul, ol {
                  margin-left: 0;
                  padding-left: 1.5em;
                }
                /* Match fonts and weights */
                h2.section-header {
                  font-size: 14pt;
                  font-weight: bold;
                  margin-top: 20pt;
                  margin-bottom: 10pt;
                }
                /* Hide elements that shouldn't be printed */
                button, .no-print {
                  display: none !important;
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
              <h1 className="text-3xl font-bold mb-2">GAAPIO DATA PROCESSING ADDENDUM</h1>
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
                This document outlines the terms for processing personal data when using Gaapio services.
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
              <section className="mb-10" id="purpose">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">1. PURPOSE & SCOPE</h2>
                <p className="mb-3">
                  This DPA governs the processing of personal data by Gaapio on behalf of Customer in connection with
                  the Services provided under the Agreement. This DPA applies to the extent Gaapio processes Customer
                  Personal Data subject to applicable Data Protection Laws.
                </p>
              </section>
              
              <section className="mb-10" id="roles">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">2. ROLES OF THE PARTIES</h2>
                <p className="mb-3">
                  Customer is the "Controller" of Customer Personal Data. Gaapio is the "Processor" and shall 
                  process data only on behalf of and in accordance with Customer's documented instructions.
                </p>
              </section>
              
              <section className="mb-10" id="types">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">3. TYPES OF DATA AND DATA SUBJECTS</h2>
                <p className="mb-3">Customer Personal Data may include:</p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Names, email addresses, and professional data of Customer's employees or clients</li>
                  <li>Content provided through uploaded documents, memos, and footnotes</li>
                </ul>
                <p className="mb-3">Data subjects may include:</p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Customer's employees</li>
                  <li>Customer's clients and stakeholders</li>
                </ul>
                <p className="mb-3">
                  Gaapio does not knowingly process special categories of personal data (e.g., health, political, biometric data).
                </p>
              </section>
              
              <section className="mb-10" id="subprocessors">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">4. SUBPROCESSORS</h2>
                <p className="mb-3">
                  Customer authorizes Gaapio to use subprocessors in connection with the provision of Services. 
                  As of the effective date, the following subprocessors are used:
                </p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Supabase – data hosting and storage (U.S.-based)</li>
                  <li>Vercel – application frontend hosting (U.S.-based)</li>
                </ul>
                <p className="mb-3">
                  Gaapio will ensure that subprocessors are bound by written agreements with data protection 
                  obligations no less protective than those in this DPA.
                </p>
              </section>
              
              <section className="mb-10" id="security">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">5. SECURITY MEASURES</h2>
                <p className="mb-3">
                  Gaapio will implement appropriate technical and organizational measures to protect Customer Personal Data, including:
                </p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Role-based access control</li>
                  <li>Encrypted data storage</li>
                  <li>Secure transmission protocols</li>
                  <li>Logging and monitoring</li>
                </ul>
              </section>
              
              <section className="mb-10" id="rights">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">6. DATA SUBJECT RIGHTS</h2>
                <p className="mb-3">
                  Gaapio shall, to the extent legally permitted and technically feasible, assist Customer in responding 
                  to requests to access, correct, or delete Personal Data in accordance with Data Protection Laws.
                </p>
              </section>
              
              <section className="mb-10" id="transfers">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">7. DATA TRANSFERS</h2>
                <p className="mb-3">
                  If Customer Personal Data originates from the EEA, UK, or Switzerland and is transferred to the United States, 
                  Gaapio shall rely on:
                </p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Standard Contractual Clauses (SCCs) for such transfers</li>
                  <li>Industry-standard safeguards for U.S.-hosted environments</li>
                </ul>
              </section>
              
              <section className="mb-10" id="retention">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">8. RETENTION AND DELETION</h2>
                <p className="mb-3">Upon expiration or termination of the Agreement, Gaapio shall:</p>
                <ul className="list-disc pl-8 mb-6 space-y-2">
                  <li>Delete or return all Customer Personal Data within 30 days</li>
                  <li>Unless otherwise required by law or regulatory obligations</li>
                </ul>
              </section>
              
              <section className="mb-10" id="audit">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">9. AUDIT RIGHTS</h2>
                <p className="mb-3">
                  Upon written request and subject to confidentiality obligations, Customer may review Gaapio's data processing practices.
                  Gaapio shall provide documentation necessary to demonstrate compliance with this DPA and Data Protection Laws.
                </p>
              </section>
              
              <section className="mb-10" id="governing">
                <h2 className="text-2xl font-bold mb-5 text-primary border-b pb-2 section-header">10. GOVERNING LAW</h2>
                <p className="mb-3">
                  This DPA is governed by the same law that governs the Agreement (Delaware, unless otherwise stated).
                </p>
              </section>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}
