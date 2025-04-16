
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, Clock, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#contact-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1 pt-28" id="contact-content">
        <section className="py-16 md:py-24" aria-labelledby="contact-heading">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 id="contact-heading" className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Get in touch with the Gaapio team.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold mb-6 sr-only">Contact Form</h2>
                <ContactForm />
              </div>
              
              <div>
                <div className="glass-card p-8 rounded-xl h-full">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 shrink-0" aria-hidden="true">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Email</h3>
                        <p className="text-muted-foreground mb-1">
                          <a href="mailto:support@gaapio.com" className="hover:underline focus:outline-none focus-visible:underline">
                            support@gaapio.com
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          We typically respond within 1 business day.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 shrink-0" aria-hidden="true">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Business Hours</h3>
                        <p className="text-muted-foreground">Monday - Friday</p>
                        <p className="text-muted-foreground">9:00 AM - 5:00 PM (Mountain Time)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 shrink-0" aria-hidden="true">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          Headquartered in Utah
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
