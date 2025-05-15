
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FAQ() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#faq-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1 pt-28" id="faq-content">
        <section className="py-16 md:py-24" aria-labelledby="faq-heading">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 id="faq-heading" className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mb-6"></div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Find answers to common questions about Gaapio.
              </p>
            </div>

            <div className="max-w-3xl mx-auto glass-card p-8 rounded-2xl shadow-md hover:bg-secondary/30 transition-all duration-300">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    How is this different from ChatGPT?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground space-y-4">
                    <p>
                      While ChatGPT can help generate ideas or draft initial language, Gaapio is purpose-built to produce accounting memos and disclosures that meet real-world audit, SEC, and internal control standards.
                    </p>
                    <p>
                      Here's what sets us apart:
                    </p>
                    <div className="space-y-4">
                      <div>
                        <p className="font-bold">Built-In Guardrails, Not Just Prompts</p>
                        <p>
                          With Gaapio, you're not guessing what to ask or how to format it. Our platform enforces accounting-specific structure, completeness, and compliance — ensuring your memo includes every key component from background to conclusion.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">Trained Specifically for Accounting</p>
                        <p>
                          Our models are fine-tuned using thousands of technical memos, accounting standards (e.g. ASC 606, 842, 805), and CPA-reviewed examples — not internet text. This creates high-confidence, domain-specific outputs ChatGPT can't reliably generate on its own.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">AI Review = Built-In Second Opinion</p>
                        <p>
                          Each memo is automatically reviewed by a separately trained AI review layer fine-tuned for QA — catching gaps, inconsistencies, or missing disclosures before you do. Think of it as a built-in senior manager reviewing every draft.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">Deep Enterprise-Grade Security</p>
                        <p>
                          Unlike ChatGPT, Gaapio is designed to secure confidential financial data. From SOC 2 controls to private data handling, we're committed to protecting sensitive company information — essential for public companies or those preparing for audit.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">Contract + Workflow Integration</p>
                        <p>
                          We don't just generate text — we digest uploaded contracts (e.g. lease agreements, purchase agreements) and identify nuanced triggers like embedded leases or performance obligations. Our AI understands and reflects accounting treatment accurately — ChatGPT alone can't track or validate across documents.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">Designed for Accountants — Not Prompt Engineers</p>
                        <p>
                          ChatGPT helps. Gaapio delivers. We give accountants an end-to-end solution that turns complex facts into submission-ready memos with embedded accounting logic — no prompt engineering, no formatting guesswork, no second guessing.
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-bold">TL;DR:</p>
                        <p>
                          ChatGPT is a helpful assistant. Gaapio is your accounting braintrust in a box.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    What types of memos can Gaapio create?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Gaapio can generate a wide range of technical accounting memos including Revenue Recognition (ASC 606), Leases (ASC 842), Business Combinations (ASC 805), Fair Value Measurements (ASC 820), Impairment (ASC 350 / ASC 360), Debt and Equity (ASC 470 / ASC 480), Stock-Based Compensation (ASC 718), Income Taxes (ASC 740), Financial Instruments (ASC 815), Segment Reporting (ASC 280), Commitments and Contingencies (ASC 450), and more. Our AI system is trained on the latest accounting standards and best practices.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    Can I customize the memo format?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Yes, Gaapio offers extensive customization options. You can adjust the structure, formatting, and level of detail in your memos to match your organization's requirements. You can also save templates for future use, ensuring consistency across your documentation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    Is it safe to upload confidential financial data?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Security is our top priority. We employ bank-level encryption for all data transfers and storage. Our systems are SOC 2 compliant, and we never share your data with third parties. Additionally, you can opt for data retention policies that align with your organization's compliance requirements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    Do you offer enterprise pricing?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Yes, we offer flexible enterprise pricing plans designed for larger accounting teams and organizations. Our enterprise plans include advanced features like team collaboration, enhanced security controls, priority support, and dedicated account management. Contact our sales team for a customized quote.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
                    What support resources are available?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Gaapio provides comprehensive support resources including detailed documentation, video tutorials, and a knowledge base covering common accounting scenarios. Our customer success team includes accounting professionals who understand your technical needs and can provide expert guidance. Enterprise customers also receive dedicated onboarding and training sessions.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mt-12 text-center animate-fade-in">
              <p className="text-muted-foreground text-sm mb-4">
                Still have questions? Contact us at info@gaapio.com or 
              </p>
              <Button asChild variant="blue" className="rounded-full">
                <Link to="/request-demo">Request a Demo</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
