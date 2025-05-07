
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-10">Last Updated: May 7, 2025</p>
            
            <div className="space-y-10">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="mb-4">
                  At Gaapio ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our services.
                </p>
                <p>
                  By using Gaapio, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this privacy policy.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="mb-2">We may collect several types of information, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Information:</strong> Name, email address, phone number, company name, job title, and payment information.</li>
                  <li><strong>Usage Data:</strong> Information on how you use our service, including features accessed, time spent, and interactions.</li>
                  <li><strong>Account Information:</strong> Login details, preferences, and settings.</li>
                  <li><strong>Content:</strong> The accounting memos and related data you create, upload, or store in our system.</li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="mb-2">We use the collected information for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Providing and maintaining our service</li>
                  <li>Notifying you about changes to our service</li>
                  <li>Allowing you to participate in interactive features</li>
                  <li>Providing customer support</li>
                  <li>Gathering analysis to improve our service</li>
                  <li>Monitoring usage of our service</li>
                  <li>Detecting, preventing, and addressing technical issues</li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="mb-4">
                  The security of your data is important to us. We implement and maintain appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                </p>
                <p>
                  However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Data Protection Rights</h2>
                <p className="mb-2">You have certain data protection rights, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> You have the right to request copies of your personal data.</li>
                  <li><strong>Rectification:</strong> You have the right to request that we correct inaccurate information about you.</li>
                  <li><strong>Erasure:</strong> You have the right to request that we delete your personal data under certain conditions.</li>
                  <li><strong>Restrict processing:</strong> You have the right to request that we restrict the processing of your data under certain conditions.</li>
                  <li><strong>Object to processing:</strong> You have the right to object to our processing of your personal data under certain conditions.</li>
                  <li><strong>Data portability:</strong> You have the right to request that we transfer the data we have collected to another organization or directly to you under certain conditions.</li>
                </ul>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p className="mb-4">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <p className="mb-4">
                  <strong>Email:</strong> privacy@gaapio.com<br />
                  <strong>Address:</strong> 123 Finance Street, Suite 400, San Francisco, CA 94104
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
