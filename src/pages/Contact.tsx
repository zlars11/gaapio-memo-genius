
import { DemoRequestForm } from "@/components/demo/DemoRequestForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, LifeBuoy } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-24">
        <ResponsiveContainer className="max-w-5xl mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
          
          <p className="text-lg text-muted-foreground mb-12 leading-7">
            Have questions about our AI-powered accounting memo platform? Want to learn more about how we can help your team? Fill out the form below and our team will get back to you shortly.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-card border rounded-lg p-8 shadow-sm">
                <DemoRequestForm />
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">General Inquiries</h3>
                      <p className="text-muted-foreground mb-2">For general questions and information</p>
                      <a href="mailto:info@gaapio.com" className="text-primary hover:underline font-medium">
                        info@gaapio.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <LifeBuoy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Support</h3>
                      <p className="text-muted-foreground mb-2">For technical support and assistance</p>
                      <a href="mailto:support@gaapio.com" className="text-primary hover:underline font-medium">
                        support@gaapio.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
