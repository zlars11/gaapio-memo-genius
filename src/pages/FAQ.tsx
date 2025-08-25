
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function FAQ() {
  const [searchParams] = useSearchParams();
  const [openItem, setOpenItem] = useState<string>("");

  useEffect(() => {
    const openParam = searchParams.get("open");
    if (openParam === "chatgpt") {
      setOpenItem("item-5");
    }
  }, [searchParams]);

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
              <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
                <AccordionItem value="item-1">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    What is Gaapio and how does it work?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Gaapio leverages the latest large language models and the vast database of public filings 
      to deliver industry leading results to technical accounting questions in seconds. 
      Answers are backed by relevant source documents empowering accountants to perform 
      exceptional analysis and deliver results faster than ever.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-2">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    Can I customize the memo and disclosure formats?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Yes, Gaapio offers extensive customization options. You can adjust the structure, 
      formatting, and level of detail to match your organization's requirements. 
      You can also save templates for future use, ensuring consistency across your documentation.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-3">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    What data is Gaapio trained on?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Gaapio is predominantly trained on the Accounting Standards Codification, Big 4 guidance, 
      SEC comment letters, and other relevant commentary to ensure the coverage and quality.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-4">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    How recent is your data?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Our database of primary sources is current and updated daily.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-5">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    How does Gaapio guard against hallucinations?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      We use specific prompts and process design along with the latest models to reduce 
      hallucinations as much as possible. If you ever second guess a Gaapio output, 
      you can ask the Gaapio AI assistant which uses a different model to research 
      and confirm or deny.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-6">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    Does Gaapio use information submitted by users to improve its system?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Gaapio does not read, share, or learn from any information input by our users without 
      explicit permission. Customer questions are stored in a secure, encrypted database, 
      only accessible to select individuals who need access to maintain the database. 
      We work with an independent auditor to maintain a SOC 2 Type 2 report on an annual basis, 
      which objectively certifies our controls to ensure the continuous security of our 
      customers' data.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-7">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    Is it safe to upload confidential financial data?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      Security and trust are fundamental to our services, and Gaapio is committed to ensuring 
      that our product and processes employ enterprise-grade best practices to keep your data safe. 
      Customer questions are stored in a secure, encrypted database, only accessible to select 
      individuals who need access to maintain the database. We work with an independent auditor 
      to maintain SOC 2 compliance, which objectively certifies our controls to ensure the 
      continuous security of our customers' data.
    </p>
  </AccordionContent>
</AccordionItem>

<AccordionItem value="item-8">
  <AccordionTrigger className="text-lg font-medium hover:text-primary transition-colors">
    How is this different from ChatGPT, Gemini or other models?
  </AccordionTrigger>
  <AccordionContent className="text-muted-foreground">
    <p>
      While ChatGPT can help generate ideas or draft initial language, Gaapio is purpose-built 
      to produce accounting memos and disclosures that meet real-world audit, SEC, and internal 
      control standards.
    </p>
    <ul className="list-disc pl-6 mt-3 space-y-2">
      <li>
        <strong>Built-In Guardrails, Not Just Prompts:</strong> Gaapio enforces accounting-specific 
        structure, completeness, and compliance — ensuring memos include every key component.
      </li>
      <li>
        <strong>Trained Specifically for Accounting:</strong> Our models are fine-tuned using thousands 
        of technical memos, ASC standards, and CPA-reviewed examples — not generic internet text.
      </li>
      <li>
        <strong>AI Review = Built-In Second Opinion:</strong> Every memo is automatically reviewed by a 
        QA-tuned AI layer, catching gaps and inconsistencies before you do.
      </li>
      <li>
        <strong>Deep Enterprise-Grade Security:</strong> Designed for SOC 2 compliance and confidential 
        financial data protection.
      </li>
      <li>
        <strong>Contract + Workflow Integration:</strong> Gaapio digests uploaded contracts and identifies 
        nuanced accounting triggers like embedded leases or performance obligations.
      </li>
      <li>
        <strong>Designed for Accountants — Not Prompt Engineers:</strong> Gaapio delivers end-to-end 
        submission-ready memos with embedded accounting logic — no formatting guesswork.
      </li>
    </ul>
    <p className="mt-3 font-semibold">
      TL;DR: ChatGPT is a helpful assistant. Gaapio is your accounting braintrust in a box.
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
