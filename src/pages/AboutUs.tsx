import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Award, 
  FileCode, 
  FileSearch
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#about-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1 pt-20" id="about-content">
        {/* Hero Section - Updated content */}
        <section className="py-16 md:py-24 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gaapio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Built by CPAs for CPAs — Accounting Excellence Meets Cutting-Edge Technology
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">We're transforming technical accounting with AI</h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-lg">
                    With over a decade of experience in both Big 4 environments and specialized accounting consultancies,
                    we understand the pain points of technical accounting documentation. That's why we built Gaapio—a 
                    purpose-built platform that transforms how accounting teams approach technical memos and documentation.
                  </p>
                  
                  <p className="text-lg">
                    What is Gaapio? It's not just another accounting tool. It's a purposefully designed 
                    workspace that transforms the entire technical memo process. Teams get clear, purpose-built
                    documentation that feels more like a guided conversation than a tedious form to populate.
                    Accountants get AI tools that match, organize, and produce a final draft of their
                    accounting memos—automatically. It's not just a better accounting platform, it's a smarter way
                    to work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Expertise Section */}
        <section className="py-16 md:py-24 border-b bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Expertise</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Big 4 Experience</h3>
                  <p className="text-muted-foreground">
                    Our founders and team members have extensive experience at Deloitte, PwC, EY, and other leading accounting firms, bringing institutional knowledge to our platform.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Technical Accounting</h3>
                  <p className="text-muted-foreground">
                    We've spent years crafting and reviewing technical accounting memos for complex transactions, ensuring compliance with evolving standards.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileCode className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Software Development</h3>
                  <p className="text-muted-foreground">
                    With 11+ years building accounting software, including contributions to NetSuite and other enterprise systems, we understand both the technical and practical needs.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileSearch className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Audit Expertise</h3>
                  <p className="text-muted-foreground">
                    Our experience auditing technical memos and footnote disclosures informs how we design tools that withstand scrutiny and provide clarity.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Compliance Specialists</h3>
                  <p className="text-muted-foreground">
                    We've spent 6+ years deeply focused on ASC 842 (Leases) and ASC 606 (Revenue), building expertise in these complex and evolving standards.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Industry Leadership</h3>
                  <p className="text-muted-foreground">
                    Our team includes veterans from Connor Group, Revenue Hub, and other specialized accounting and finance institutions that shape industry best practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section className="py-16 md:py-24 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <h2 className="text-3xl font-bold mb-6">Our Philosophy: Reliability Meets Innovation</h2>
                  
                  <p className="text-lg mb-6">
                    We believe accountants deserve cutting-edge technology that doesn't sacrifice reliability. 
                    Our platform is built on the foundation of practitioner knowledge, ensuring that innovation 
                    enhances—rather than disrupts—the accounting workflow.
                  </p>
                  
                  <p className="text-lg mb-6">
                    Having spent years in the trenches of technical accounting, we've experienced firsthand the 
                    challenges of documentation workflows. Gaapio addresses these pain points with thoughtful 
                    design informed by real accounting experience.
                  </p>
                  
                  <p className="text-lg">
                    Our commitment to quality extends beyond our product. As CPAs ourselves, we uphold the profession's 
                    highest standards of integrity, accuracy, and excellence in everything we build.
                  </p>
                </div>
                
                <div className="order-1 md:order-2 rounded-xl overflow-hidden border shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200" 
                    alt="Gaapio team collaborating" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Building on Experience Section */}
        <section className="py-16 md:py-24 bg-muted/30 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Building on Experience</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our journey from accounting professionals to software innovators
                </p>
              </div>
              
              <div className="relative border-l border-muted-foreground/30 pl-8 ml-4 space-y-10">
                <div className="relative">
                  <div className="absolute -left-[41px] p-1 rounded-full bg-background border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Big 4 Foundations</h3>
                  <p className="text-muted-foreground">
                    Our journey began in the audit and advisory departments of Big 4 firms, where we developed rigorous technical accounting expertise and understood the importance of quality documentation.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] p-1 rounded-full bg-background border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Software Development</h3>
                  <p className="text-muted-foreground">
                    We transitioned into building accounting software, including contributions to NetSuite and other enterprise systems, gaining first-hand experience with how technology can enhance accounting workflows.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] p-1 rounded-full bg-background border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Technical Standards Focus</h3>
                  <p className="text-muted-foreground">
                    For over six years, we've specialized in implementing ASC 842 and ASC 606, developing deep expertise in these complex areas that many accountants struggle with.
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[41px] p-1 rounded-full bg-background border">
                    <div className="w-6 h-6 rounded-full bg-primary"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Creating Gaapio</h3>
                  <p className="text-muted-foreground">
                    Frustrated with the limitations of existing solutions, we founded Gaapio to address the specific challenges of technical accounting documentation, combining our accounting expertise with advanced technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Values Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  The principles that guide our work and define our approach to serving accounting professionals
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Practitioner-First Design</h3>
                  <p className="text-muted-foreground">
                    Everything we build is designed from the perspective of working accountants, ensuring our solutions solve real problems in practical ways.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Technical Excellence</h3>
                  <p className="text-muted-foreground">
                    We maintain rigorous standards for accounting accuracy and compliance, ensuring our technology enhances rather than compromises professional standards.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Continuous Innovation</h3>
                  <p className="text-muted-foreground">
                    We constantly explore new technologies and approaches that can make accounting work more efficient and effective.
                  </p>
                </div>
                
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold mb-3">Professional Integrity</h3>
                  <p className="text-muted-foreground">
                    As CPAs ourselves, we uphold the highest standards of the accounting profession in everything we do.
                  </p>
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
