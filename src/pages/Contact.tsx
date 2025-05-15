
import { ContactForm } from "@/components/contact/ContactForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, LifeBuoy, DollarSign } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Contact() {
  // Reference for scroll animation
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Add scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => {
      if (contentRef.current) {
        observer.unobserve(contentRef.current);
      }
      if (cardsRef.current) {
        observer.unobserve(cardsRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer className="max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-7 max-w-3xl mx-auto text-center">
              Have a question or want to see Gaapio in action? Fill out the form and our team will get back to you shortly.
            </p>
          </div>
          
          {/* Contact form with enhanced styling */}
          <div 
            ref={contentRef}
            className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 mb-12 opacity-0"
          >
            <ContactForm />
          </div>
          
          {/* Contact cards side by side, with third card added */}
          <div 
            ref={cardsRef}
            className="grid md:grid-cols-3 gap-6 mb-8 opacity-0"
          >
            <Card className="transition-all duration-300 hover:shadow-md rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">General Inquiries</h3>
                    <p className="text-muted-foreground mb-2">For general questions and information</p>
                    <a href="mailto:info@gaapio.com" className="text-primary hover:underline font-medium">
                      info@gaapio.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-md rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <LifeBuoy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Support</h3>
                    <p className="text-muted-foreground mb-2">For technical support and assistance</p>
                    <a href="mailto:support@gaapio.com" className="text-primary hover:underline font-medium">
                      support@gaapio.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="transition-all duration-300 hover:shadow-md rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Sales</h3>
                    <p className="text-muted-foreground mb-2">For pricing and purchasing information</p>
                    <a href="mailto:sales@gaapio.com" className="text-primary hover:underline font-medium">
                      sales@gaapio.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
