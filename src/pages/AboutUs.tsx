
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Users, CheckCircle, Building } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#about-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1 pt-28" id="about-content">
        <section className="py-16 md:py-24" aria-labelledby="about-heading">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 id="about-heading" className="text-4xl md:text-5xl font-bold mb-6">About Gaapio</h1>
              <p className="text-xl text-muted-foreground">
                Built by CPAs, for accounting professionals.
              </p>
            </div>

            <div className="max-w-3xl mx-auto glass-card p-8 rounded-xl mb-16">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6">
                To help accounting teams instantly generate technical accounting memos with AI that saves time, ensures compliance, and scales with growth.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-12" aria-label="Core strengths">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4" aria-hidden="true">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Big 4 Background</h3>
                  <p className="text-sm text-muted-foreground">
                    Founded by CPAs with extensive Big 4 audit experience
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4" aria-hidden="true">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Industry Expertise</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep knowledge of technical accounting requirements and writing technical accounting memos
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 mb-4" aria-hidden="true">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Software Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Track record of building accounting software
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Approach</h2>
              <p className="text-lg mb-6">
                At Gaapio, we combine our accounting expertise with cutting-edge AI technology to create a tool that truly understands the complexities of technical accounting memos.
              </p>
              <p className="text-lg mb-6">
                Our professional yet approachable platform guides you through the process, ensuring accuracy and compliance while dramatically reducing the time spent on documentation.
              </p>
              <p className="text-lg">
                We're committed to continuous improvement, regularly updating our systems to reflect the latest accounting standards and best practices.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
