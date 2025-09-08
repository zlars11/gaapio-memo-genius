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
                a Utah corporation ("Gaapio"), and the subscribing entity identified in an executed ordering 
                document that references this Agreement ("Customer"). This Agreement governs Customer's access to 
                and use of Gaapio's software-as-a-service platform and related offerings.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">1. DEFINITIONS</h2>
              <p>
                "Software Services" means Gaapio's proprietary AI-powered platform for automating accounting memo 
                generation, disclosure applications, contract analysis and other related analysis, including all 
                features, tools, modules, and enhancements ordered by Customer.
              </p>
              <p>
                "Customer Content" means all data, documentation, text, or inputs uploaded by Customer or its 
                Users to the Software Services or otherwise transmitted for processing.
              </p>
              <p>
                "Deliverables" means output, reports, and other materials generated through Customer's use of the Software Services.
              </p>
              <p>
                "Order Form" means any order form, quote, or online purchasing flow executed by the parties that 
                references this Agreement and specifies the services to be delivered.
              </p>
              <p>
                "Documentation" means user instructions, product information, and explanatory materials provided 
                by Gaapio related to the use of the Software Services.
              </p>
              <p>
                "Professional Services" means implementation, configuration, and consulting services performed by 
                Gaapio, as specified in an Order Form or statement of work ("SOW").
              </p>
              <p>
                "Subscription Term" means the duration of Customer's subscription to the Software Services, as set forth 
                in the applicable Order Form.
              </p>
              <p>
                "Users" means individuals authorized by Customer to access and use the Software Services.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. ACCESS & USE RIGHTS</h2>
              <p>
                Subject to the terms of this Agreement, Gaapio grants Customer a limited, non-exclusive, 
                non-transferable right to access and use the Software Services and Deliverables during the Subscription 
                Term solely for Customer's internal business operations. All rights not expressly granted are 
                reserved by Gaapio.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. CUSTOMER RESPONSIBILITIES</h2>
              <p className="mb-4">Customer is responsible for:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintaining the confidentiality of login credentials and restricting access to authorized Users.</li>
                <li>Ensuring its use of the Software Services complies with applicable laws and this Agreement.</li>
                <li>The accuracy, quality, and legality of Customer Content.</li>
              </ul>
              <p className="mb-4">Customer shall not:</p>
              <ul className="list-disc pl-6">
                <li>Use the Software Services to infringe intellectual property rights or engage in illegal activities.</li>
                <li>Decompile, reverse engineer, or create derivative works from the Software Services.</li>
                <li>Use the Software Services to develop competing offerings.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. FEES, BILLING & TAXES</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Fees and Payment.</h3>
              <p>
                All fees are due and payable in accordance with the applicable Order Form and within thirty (30) days 
                of the invoice date, unless otherwise specified. Late payments shall accrue interest at the rate of 1.5% 
                per month (or the maximum rate permitted by law, if lower). Gaapio may suspend access to the Services 
                for any payment not received when due.
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
                <li>Customer must cease all use of the Software Services;</li>
                <li>Gaapio may delete Customer Content and Deliverables thirty (30) days after termination, unless legally prohibited. During such period, Customer may request export of its data in a commonly available format.</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. INTELLECTUAL PROPERTY</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Ownership.</h3>
              <p>
                Customer retains ownership of Customer Content. Gaapio retains ownership of the Software Services, 
                platform, and any improvements or feedback provided.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 License to Data.</h3>
              <p>
                Customer grants Gaapio a limited license to use Customer Content for the purpose of providing 
                the Software Services.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Usage Data and Improvements.</h3>
              <p>
                Gaapio may collect and use aggregated, de-identified technical and usage data for purposes of analytics 
                and improving the Software Services. For clarity, Customer Content shall not be used to train artificial 
                intelligence or machine learning models, except to the extent such Content has been de-identified and 
                incorporated into aggregate analytics.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. CONFIDENTIALITY</h2>
              <p>
                Each party shall keep confidential all non-public information received from the other party that is 
                designated as confidential or that reasonably should be understood to be confidential. These obligations 
                shall survive for five (5) years following termination of this Agreement. Notwithstanding the foregoing, 
                a party may disclose confidential information as required by applicable law, regulation, or court order, 
                provided it gives prompt written notice to the other party (unless legally prohibited) and reasonably 
                cooperates, at the other party's expense, to limit or contest such disclosure.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. WARRANTIES & DISCLAIMERS</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Limited Warranty.</h3>
              <p>
                Gaapio warrants that the Software Services will materially conform to the applicable Documentation 
                during the Subscription Term.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Disclaimers.</h3>
              <p className="uppercase">
                EXCEPT AS EXPRESSLY PROVIDED, GAAPIO DISCLAIMS ALL OTHER WARRANTIES, INCLUDING IMPLIED 
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. 
                THE SOFTWARE SERVICES ARE PROVIDED "AS IS."
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Outputs and Reliance.</h3>
              <p>
                Deliverables generated by the Software Services are provided for informational purposes only. Gaapio 
                is not a certified public accounting firm or a law firm, and the Services do not constitute accounting, 
                audit, tax, legal, or other professional advice. Customer remains solely responsible for verifying the 
                accuracy, completeness, and compliance of all Deliverables and for all decisions made in reliance thereon.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. LIMITATION OF LIABILITY</h2>
              <p className="uppercase">
                IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR 
                PUNITIVE DAMAGES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EXCEPT FOR THE EXCLUSIONS BELOW, 
                GAAPIO'S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING UNDER OR RELATED TO THIS AGREEMENT SHALL NOT 
                EXCEED THE AMOUNTS ACTUALLY PAID BY CUSTOMER TO GAAPIO UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS 
                PRECEDING THE CLAIM. FOR SERVICE LEVEL FAILURES, CUSTOMER'S SOLE AND EXCLUSIVE REMEDY SHALL BE THE 
                SERVICE CREDITS EXPRESSLY SET FORTH IN THE APPLICABLE SERVICE LEVEL AGREEMENT. GAAPIO SHALL HAVE NO 
                LIABILITY FOR ANY LOSS, ALTERATION, OR CORRUPTION OF DATA, EXCEPT TO THE EXTENT CAUSED BY GAAPIO'S 
                GROSS NEGLIGENCE OR WILLFUL MISCONDUCT. THE FOREGOING LIMITATIONS SHALL NOT APPLY TO (I) CUSTOMER'S 
                INDEMNITY OBLIGATIONS, (II) EITHER PARTY'S BREACH OF CONFIDENTIALITY, OR (III) FRAUD, GROSS NEGLIGENCE, 
                OR WILLFUL MISCONDUCT.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. INDEMNIFICATION</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">Customer Indemnity:</h3>
              <p>
                Customer shall indemnify, defend, and hold harmless Gaapio from and against any third-party claims, 
                damages, liabilities, and expenses arising out of (a) Customer Content, (b) Customer's use of the 
                Services in violation of this Agreement, applicable law, or third-party rights, or (c) Customer's 
                breach of this Agreement.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">Gaapio Indemnity:</h3>
              <p>
                Gaapio shall indemnify, defend, and hold harmless Customer from and against any third-party claim 
                alleging that the Software Services, as provided by Gaapio (excluding Customer Content, Deliverables, 
                third-party integrations, and open-source components), directly infringe or misappropriate any U.S. 
                patent, copyright, or trademark, provided that Customer (i) promptly notifies Gaapio in writing of the 
                claim, (ii) grants Gaapio sole control of the defense and settlement of the claim, and (iii) provides 
                Gaapio with all reasonable assistance, at Gaapio's expense.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">Exclusions:</h3>
              <p>
                Gaapio shall have no indemnity obligation for claims arising from reliance on Deliverables, 
                modifications not made by Gaapio, combination with non-Gaapio products, or Customer's misuse.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">11. COMPLIANCE, SECURITY, & DATA PROCESSING</h2>
              <p className="mb-4">
                Gaapio implements industry-standard technical and organizational safeguards to protect Customer Content. 
                Customer acknowledges that Gaapio is not responsible for ensuring Customer's compliance with 
                industry-specific regulations (e.g., SOX, SEC, GAAP, HIPAA, GDPR) unless expressly agreed in writing. 
                Customer remains solely responsible for use of Deliverables in compliance with applicable laws and 
                regulations. If required by law, the parties will execute a separate Data Processing Addendum. Customer 
                may request export of its data prior to deletion at termination.
              </p>
              <p>
                <strong>Sensitive Data Restrictions.</strong> Customer agrees not to upload, transmit, or otherwise 
                process through the Software Services any sensitive or regulated data (including but not limited to 
                personal health information subject to HIPAA, payment card information subject to PCI DSS, social 
                security numbers, driver's license numbers, or other government identifiers) unless expressly agreed 
                in writing by Gaapio in a separate Data Processing Addendum. Gaapio shall have no responsibility or 
                liability for such data if uploaded in violation of this Agreement.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">12. DISPUTE RESOLUTION & GOVERNING LAW</h2>
              <p>
                This Agreement is governed by the laws of Utah without regard to conflict of laws. Any dispute 
                shall be resolved by binding arbitration under the Commercial Rules of the American Arbitration 
                Association in Utah. Arbitration proceedings and awards shall remain confidential. Notwithstanding 
                the foregoing, Gaapio may seek injunctive relief in court to prevent unauthorized use or disclosure 
                of its intellectual property. All claims must be brought in a party's individual capacity, and not 
                as a plaintiff or class member in any class action or representative proceeding.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">13. GENERAL PROVISIONS</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.1 Entire Agreement.</h3>
              <p>
                This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements.
              </p>
              <h3 className="text-xl font-semibold mt-6 mb-3">13.2 Assignment.</h3>
              <p>
                Neither party may assign this Agreement without written consent, except that Gaapio may assign 
                freely in connection with merger, acquisition, corporate reorganization, or financing.
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
              <h3 className="text-xl font-semibold mt-6 mb-3">13.6 Name and Logo.</h3>
              <p>
                Unless Customer notifies Gaapio in writing to opt out, Gaapio may use Customer's name and logo in its 
                marketing materials and customer lists. Any case study, press release, or other public reference to 
                Customer's specific use of the Services shall require Customer's prior written consent.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">14. SERVICE LEVEL AGREEMENT (SLA)</h2>
              <p>
                Gaapio will use commercially reasonable efforts to ensure that the Software Services are available 
                99.5% of the time, excluding scheduled maintenance and force majeure. Customer's sole and exclusive 
                remedy for any failure to meet the SLA shall be service credits equal to a prorated portion of fees 
                for the affected period. Service credits may be applied to future invoices and shall not exceed one 
                month's subscription fees.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">15. SUPPORT COMMITMENT</h2>
              <p>
                Gaapio will provide email-based support during normal business hours, Monday through Friday, 
                excluding U.S. federal holidays.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">16. SURVIVAL</h2>
              <p>
                Sections 6 (Intellectual Property), 7 (Confidentiality), 8.2–8.3 (Disclaimers), 9 (Limitation of Liability), 
                10 (Indemnification), and 12 (Dispute Resolution) shall survive any termination or expiration of this Agreement.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">17. AI TRAINING LIMITATIONS</h2>
              <p>
                Gaapio will not use Customer Content to train general-purpose AI models. Any use of Customer Content 
                is limited to fulfilling Customer's requests or improving performance for that specific Customer account.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">18. INSURANCE</h2>
              <p>
                Gaapio shall maintain commercially reasonable insurance coverage, including general liability and cyber 
                liability coverage. Upon Customer's reasonable request, but no more than once annually, Gaapio shall 
                provide certificates of insurance, which shall be treated as Gaapio's confidential information.
              </p>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      
      <Footer />
    </div>
  );
}