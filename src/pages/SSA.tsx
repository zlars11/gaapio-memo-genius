
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export default function SSA() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        <ResponsiveContainer className="max-w-4xl my-8">
          <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h1 className="text-3xl font-bold mb-8 text-center">GAAPIO SUBSCRIPTION SERVICES AGREEMENT</h1>
              
              <p className="mb-8">
                This Subscription Services Agreement ("Agreement") is entered into by and between Gaapio, Inc., 
                a Delaware corporation ("Gaapio"), and the subscribing entity identified in an executed ordering 
                document that references this Agreement ("Customer"). This Agreement governs Customer's access to 
                and use of Gaapio's artificial intelligence-based software-as-a-service platform and related offerings.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">1. DEFINITIONS</h2>
              <p>
                "AI Services" means Gaapio's proprietary AI-powered platform for automating accounting memo 
                generation and related analysis, including all features, tools, modules, and enhancements 
                ordered by Customer.
              </p>
              <p>
                "Customer Content" means all data, documentation, text, or inputs uploaded by Customer or its 
                Users to the AI Services or otherwise transmitted for processing.
              </p>
              <p>
                "Deliverables" means output, reports, and other materials generated through Customer's use of the AI Services.
              </p>
              <p>
                "Order Form" means any order form, quote, or online purchasing flow executed by the parties that 
                references this Agreement and specifies the services to be delivered.
              </p>
              <p>
                "Documentation" means user instructions, product information, and explanatory materials provided 
                by Gaapio related to the use of the AI Services.
              </p>
              <p>
                "Professional Services" means implementation, configuration, and consulting services performed by 
                Gaapio, as specified in an Order Form or statement of work ("SOW").
              </p>
              <p>
                "Subscription Term" means the duration of Customer's subscription to the AI Services, as set forth 
                in the applicable Order Form.
              </p>
              <p>
                "Users" means individuals authorized by Customer to access and use the AI Services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. ACCESS & USE RIGHTS</h2>
              <p>
                Subject to the terms of this Agreement, Gaapio grants Customer a limited, non-exclusive, 
                non-transferable right to access and use the AI Services and Deliverables during the Subscription 
                Term solely for Customer's internal business operations. All rights not expressly granted are 
                reserved by Gaapio.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. CUSTOMER RESPONSIBILITIES</h2>
              <p className="mb-4">Customer is responsible for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintaining the confidentiality of login credentials and restricting access to authorized Users.</li>
                <li>Ensuring its use of the AI Services complies with applicable laws and this Agreement.</li>
                <li>The accuracy, quality, and legality of Customer Content.</li>
              </ul>
              <p className="mb-4">Customer shall not:</p>
              <ul className="list-disc pl-6">
                <li>Use the Services to infringe intellectual property rights or engage in illegal activities.</li>
                <li>Decompile, reverse engineer, or create derivative works from the AI Services.</li>
                <li>Use the AI Services to develop competing offerings.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. FEES, BILLING & TAXES</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Fees and Payment.</h3>
              <p>
                All fees are due in accordance with the Order Form and payable within 30 days of invoice unless 
                otherwise specified. Late payments may incur a monthly interest charge of 1.5%.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Usage-Based Adjustments.</h3>
              <p>
                If Customer exceeds usage volumes specified in the Order Form, Gaapio may invoice for the excess 
                usage at the rates stated in the Order Form or Gaapio's then-current pricing.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Taxes.</h3>
              <p>
                Fees are exclusive of all applicable taxes. Customer shall be responsible for payment of all taxes 
                except those based on Gaapio's income.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. TERM & TERMINATION</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Term.</h3>
              <p>
                This Agreement shall remain in effect for the duration of all active Subscription Terms unless 
                earlier terminated.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Termination.</h3>
              <p className="mb-4">Either party may terminate this Agreement:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>With written notice of non-renewal delivered at least 30 days before the end of a Subscription Term;</li>
                <li>For material breach not cured within 30 days (or 14 days for payment breaches);</li>
                <li>Immediately upon the other party's insolvency or bankruptcy.</li>
              </ul>
              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Effect of Termination.</h3>
              <p className="mb-4">Upon termination:</p>
              <ul className="list-disc pl-6">
                <li>All access rights are revoked;</li>
                <li>Customer must cease all use of the AI Services;</li>
                <li>Gaapio may delete Customer Content and Deliverables after a reasonable period.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. INTELLECTUAL PROPERTY</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Ownership.</h3>
              <p>
                Customer retains ownership of Customer Content. Gaapio retains ownership of the AI Services, 
                platform, and any improvements or feedback provided.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 License to Data.</h3>
              <p>
                Customer grants Gaapio a limited license to use Customer Content for the purpose of providing 
                the AI Services.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Usage Data and Improvements.</h3>
              <p>
                Gaapio may use aggregated, de-identified usage data to improve the AI Services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. CONFIDENTIALITY</h2>
              <p>
                Each party agrees to maintain in confidence any non-public information received from the other 
                party that is designated as confidential or that reasonably should be understood to be confidential. 
                Confidentiality obligations shall survive for five (5) years after termination of this Agreement.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. WARRANTIES & DISCLAIMERS</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Limited Warranty.</h3>
              <p>
                Gaapio warrants that the AI Services will materially conform to the applicable Documentation 
                during the Subscription Term.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Disclaimers.</h3>
              <p className="uppercase">
                EXCEPT AS EXPRESSLY PROVIDED, GAAPIO DISCLAIMS ALL OTHER WARRANTIES, INCLUDING IMPLIED 
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                THE AI SERVICES ARE PROVIDED "AS IS."
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Outputs and Reliance.</h3>
              <p>
                Deliverables generated by the AI Services are for informational purposes only. They are not 
                intended to constitute accounting or legal advice, and Customer is solely responsible for 
                verifying accuracy and compliance.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. LIMITATION OF LIABILITY</h2>
              <p className="uppercase">
                IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. 
                GAAPIO'S AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNTS PAID BY CUSTOMER IN THE TWELVE (12) 
                MONTHS PRECEDING THE CLAIM.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. INDEMNIFICATION</h2>
              <p>
                Each party agrees to indemnify, defend, and hold the other party harmless from third-party claims 
                arising from breach of this Agreement, violation of applicable law, or infringement caused by 
                materials provided by the indemnifying party, subject to prompt notice and control over defense.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">11. COMPLIANCE, SECURITY, & DATA PROCESSING</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">11.1 Data Security.</h3>
              <p>
                Gaapio implements industry-standard technical and organizational safeguards to protect Customer Content.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">11.2 Data Processing.</h3>
              <p>
                If required by applicable law (e.g., GDPR or CCPA), the parties will execute a separate Data 
                Processing Addendum.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">11.3 Export Compliance.</h3>
              <p>
                Customer shall not use the AI Services in violation of U.S. export laws or regulations.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">12. DISPUTE RESOLUTION & GOVERNING LAW</h2>
              <p>
                This Agreement is governed by the laws of Delaware without regard to conflict of laws. Any dispute 
                shall be resolved by binding arbitration under the Commercial Rules of the American Arbitration 
                Association in Delaware. The prevailing party shall be entitled to reasonable legal fees.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">13. GENERAL PROVISIONS</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.1 Entire Agreement.</h3>
              <p>
                This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.2 Assignment.</h3>
              <p>
                Neither party may assign this Agreement without written consent, except to a successor entity.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.3 Force Majeure.</h3>
              <p>
                Neither party shall be liable for delays due to causes beyond their reasonable control.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.4 Counterparts.</h3>
              <p>
                This Agreement may be executed in counterparts, including electronically.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.5 No Legal Advice.</h3>
              <p>
                Gaapio is not a licensed CPA firm and does not offer legal, tax, or accounting advice.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}
