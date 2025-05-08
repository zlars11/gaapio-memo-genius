
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
              <p className="text-xl text-muted-foreground">
                Find answers to common questions about Gaapio.
              </p>
            </div>

            <div className="max-w-3xl mx-auto glass-card p-8 rounded-xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    What types of memos can Gaapio create?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p className="mb-4">
                      Gaapio can generate a wide range of technical accounting memos including Revenue Recognition (ASC 606), Leases (ASC 842), Business Combinations (ASC 805), Fair Value Measurements (ASC 820), Impairment (ASC 350 / ASC 360), Debt and Equity (ASC 470 / ASC 480), Stock-Based Compensation (ASC 718), Income Taxes (ASC 740), Financial Instruments (ASC 815), Segment Reporting (ASC 280), Commitments and Contingencies (ASC 450), and more. Our AI system is trained on the latest accounting standards and best practices.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    Can I customize the memo format?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Yes, Gaapio offers extensive customization options. You can adjust the structure, formatting, and level of detail in your memos to match your organization's requirements. You can also save templates for future use, ensuring consistency across your documentation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    Is it safe to upload confidential financial data?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Security is our top priority. We employ bank-level encryption for all data transfers and storage. Our systems are SOC 2 compliant, and we never share your data with third parties. Additionally, you can opt for data retention policies that align with your organization's compliance requirements.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    Do you offer enterprise pricing?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Yes, we offer flexible enterprise pricing plans designed for larger accounting teams and organizations. Our enterprise plans include advanced features like team collaboration, enhanced security controls, priority support, and dedicated account management. Contact our sales team for a customized quote.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    How is this different from ChatGPT?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>
                      Unlike general-purpose AI tools like ChatGPT, Gaapio is specifically designed for technical accounting documentation. Our platform is built by CPAs with Big 4 backgrounds and is trained on accounting standards and best practices. We provide structured workflows, accounting-specific features, and compliance-focused outputs that ensure accuracy and relevance for accounting professionals.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">
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
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
