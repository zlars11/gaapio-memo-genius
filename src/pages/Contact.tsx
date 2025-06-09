
import { ContactForm } from "@/components/contact/ContactForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, LifeBuoy, DollarSign } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ContactFormSuccess } from "@/components/contact/ContactFormSuccess";

export default function Contact() {
  // Reference for scroll animation
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-background dark:to-background/95">
      <Header />
      <main className="flex-1 pt-32 pb-16">
        <ResponsiveContainer className="max-w-5xl">
          {formSubmitted ? (
            <ContactFormSuccess />
          ) : (
            <>
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Contact Us</h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-7 max-w-3xl mx-auto text-center">
                  Have a question or want to see Gaapio in action? Fill out the form and our team will get back to you shortly.
                </p>
              </div>
              
              {/* Contact form with enhanced styling to match demo form */}
              <div 
                ref={contentRef}
                className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 mb-12 opacity-0"
              >
                <ContactForm onSubmitSuccess={handleFormSuccess} />
              </div>
              
              {/* Contact cards with enhanced styling */}
              <div 
                ref={cardsRef}
                className="grid md:grid-cols-3 gap-6 mb-8 opacity-0"
              >
                <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl overflow-hidden border-gray-200 dark:border-border">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-full">
                        <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3">General Inquiries</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">For general questions and information</p>
                    <a href="mailto:info@gaapio.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg">
                      info@gaapio.com
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl overflow-hidden border-gray-200 dark:border-border">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-full">
                        <LifeBuoy className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Support</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">For technical support and assistance</p>
                    <a href="mailto:support@gaapio.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg">
                      support@gaapio.com
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-2xl overflow-hidden border-gray-200 dark:border-border">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-full">
                        <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3">Sales</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">For pricing and purchasing information</p>
                    <a href="mailto:sales@gaapio.com" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-lg">
                      sales@gaapio.com
                    </a>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
