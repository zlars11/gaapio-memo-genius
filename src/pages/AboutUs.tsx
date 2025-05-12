
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Award, 
  FileCode, 
  FileSearch,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AboutUs() {
  // Section refs for scroll animations
  const introRef = useRef<HTMLElement>(null);
  const expertiseRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  
  // Visibility states for animations
  const [introVisible, setIntroVisible] = useState(false);
  const [expertiseVisible, setExpertiseVisible] = useState(false);
  const [philosophyVisible, setPhilosophyVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  
  // Setup observers for each section
  useEffect(() => {
    const createObserver = (
      ref: React.RefObject<HTMLElement>,
      setVisible: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.6 } // Trigger when 60% of section is visible
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return observer;
    };

    const introObserver = createObserver(introRef, setIntroVisible);
    const expertiseObserver = createObserver(expertiseRef, setExpertiseVisible);
    const philosophyObserver = createObserver(philosophyRef, setPhilosophyVisible);
    const timelineObserver = createObserver(timelineRef, setTimelineVisible);
    const valuesObserver = createObserver(valuesRef, setValuesVisible);

    // Cleanup observers
    return () => {
      if (introRef.current) introObserver.unobserve(introRef.current);
      if (expertiseRef.current) expertiseObserver.unobserve(expertiseRef.current);
      if (philosophyRef.current) philosophyObserver.unobserve(philosophyRef.current);
      if (timelineRef.current) timelineObserver.unobserve(timelineRef.current);
      if (valuesRef.current) valuesObserver.unobserve(valuesRef.current);
    };
  }, []);
  
  // Data for expertise section
  const expertiseItems = [
    {
      icon: Award,
      title: "Big 4 Experience",
      description: "Our founders and team members have extensive experience at Deloitte, PwC, EY, and other leading accounting firms, bringing institutional knowledge to our platform."
    },
    {
      icon: FileText,
      title: "Technical Accounting",
      description: "We've spent years crafting and reviewing technical accounting memos for complex transactions, ensuring compliance with evolving standards."
    },
    {
      icon: FileCode,
      title: "Software Development",
      description: "With 11+ years building accounting software, including contributions to NetSuite and other enterprise systems, we understand both the technical and practical needs."
    },
    {
      icon: FileSearch,
      title: "Audit Expertise",
      description: "Our experience auditing technical memos and footnote disclosures informs how we design tools that withstand scrutiny and provide clarity."
    },
    {
      icon: ShieldCheck,
      title: "Compliance Specialists",
      description: "We've spent 6+ years deeply focused on ASC 842 (Leases) and ASC 606 (Revenue), building expertise in these complex and evolving standards."
    },
    {
      icon: Briefcase,
      title: "Industry Leadership",
      description: "Our team includes veterans from Connor Group, Revenue Hub, and other specialized accounting and finance institutions that shape industry best practices."
    }
  ];
  
  // Data for timeline section
  const timelineEvents = [
    {
      title: "Big 4 Foundations",
      description: "Our journey began in the audit and advisory departments of Big 4 firms, where we developed rigorous technical accounting expertise and understood the importance of quality documentation."
    },
    {
      title: "Software Development",
      description: "We transitioned into building accounting software, including contributions to NetSuite and other enterprise systems, gaining first-hand experience with how technology can enhance accounting workflows."
    },
    {
      title: "Technical Standards Focus",
      description: "For over six years, we've specialized in implementing ASC 842 and ASC 606, developing deep expertise in these complex areas that many accountants struggle with."
    },
    {
      title: "Creating Gaapio",
      description: "Frustrated with the limitations of existing solutions, we founded Gaapio to address the specific challenges of technical accounting documentation, combining our accounting expertise with advanced technology."
    }
  ];
  
  // Data for values section
  const valuesItems = [
    {
      title: "Practitioner-First Design",
      description: "Everything we build is designed from the perspective of working accountants, ensuring our solutions solve real problems in practical ways."
    },
    {
      title: "Technical Excellence",
      description: "We maintain rigorous standards for accounting accuracy and compliance, ensuring our technology enhances rather than compromises professional standards."
    },
    {
      title: "Continuous Innovation",
      description: "We constantly explore new technologies and approaches that can make accounting work more efficient and effective."
    },
    {
      title: "Professional Integrity",
      description: "As CPAs ourselves, we uphold the highest standards of the accounting profession in everything we do."
    }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      {/* Skip to content link for keyboard users */}
      <a href="#about-content" className="skip-to-content">
        Skip to content
      </a>
      
      <main className="flex-1" id="about-content">
        {/* Intro Section - Blue background */}
        <section 
          ref={introRef}
          className="py-16 md:py-24 bg-[#f4faff]"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div 
                className={cn(
                  "text-center mb-16 transition-all",
                  introVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-[30px]"
                )}
                style={{ 
                  transitionDuration: "2000ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gaapio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Built by CPAs for CPAs — Accounting Excellence Meets Cutting-Edge Technology
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div 
                  className={cn(
                    "flex justify-center transition-all",
                    introVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-[30px]"
                  )}
                  style={{ 
                    transitionDelay: "600ms",
                    transitionDuration: "2000ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                >
                  <img 
                    src="/lovable-uploads/e263b9d6-518b-411f-be9f-c36067fd9ad1.png" 
                    alt="Two CPA accountants working together" 
                    className="rounded-lg shadow-md max-w-full h-auto"
                  />
                </div>
                
                <div 
                  className={cn(
                    "space-y-6 transition-all",
                    introVisible 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-[30px]"
                  )}
                  style={{ 
                    transitionDelay: "1200ms",
                    transitionDuration: "2000ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                  }}
                >
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
        <section 
          ref={expertiseRef}
          className="py-16 md:py-24 border-t border-b border-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Our Expertise</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {expertiseItems.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4faff]",
                      expertiseVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-[30px]"
                    )}
                    style={{ 
                      transitionDelay: `${index * 600}ms`,
                      transitionDuration: "2000ms",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  >
                    <div className="mt-1 text-[#339CFF] flex-shrink-0">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Philosophy Section */}
        <section 
          ref={philosophyRef}
          className="py-16 md:py-24 bg-[#f4faff] border-b"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              <div 
                className={cn(
                  "text-left space-y-6 transition-all",
                  philosophyVisible 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-[30px]"
                )}
                style={{ 
                  transitionDuration: "2000ms",
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                }}
              >
                <div className="border-l-4 border-[#339CFF] pl-6 py-2">
                  <h2 className="text-3xl font-bold mb-6">Our Philosophy: Reliability Meets Innovation</h2>
                </div>
                
                <p className="text-lg leading-relaxed">
                  We believe accountants deserve cutting-edge technology that doesn't sacrifice reliability. 
                  Our platform is built on the foundation of practitioner knowledge, ensuring that innovation 
                  enhances—rather than disrupts—the accounting workflow.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Having spent years in the trenches of technical accounting, we've experienced firsthand the 
                  challenges of documentation workflows. Gaapio addresses these pain points with thoughtful 
                  design informed by real accounting experience.
                </p>
                
                <p className="text-lg leading-relaxed">
                  Our commitment to quality extends beyond our product. As CPAs ourselves, we uphold the profession's 
                  highest standards of integrity, accuracy, and excellence in everything we build.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Building on Experience Section */}
        <section 
          ref={timelineRef}
          className="py-16 md:py-24 border-b"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Building on Experience</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our journey from accounting professionals to software innovators
                </p>
              </div>
              
              <div className="relative border-l border-muted-foreground/30 pl-8 ml-4 space-y-12">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "relative transition-all group",
                      timelineVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-[30px]"
                    )}
                    style={{ 
                      transitionDelay: `${index * 600}ms`,
                      transitionDuration: "2000ms",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  >
                    <div className="absolute -left-[41px] p-1 rounded-full bg-background border group-hover:border-[#339CFF] transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-[#339CFF] group-hover:scale-110 group-hover:shadow-[0_0_0_4px_rgba(51,156,255,0.2)] transition-all duration-300"></div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#339CFF] transition-colors duration-300">{event.title}</h3>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Values Section */}
        <section 
          ref={valuesRef}
          className="py-16 md:py-24 bg-[#f4faff]"
        >
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  The principles that guide our work and define our approach to serving accounting professionals
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {valuesItems.map((value, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex gap-3 transition-all hover:scale-[1.02] hover:bg-[#f0f9ff] p-4 rounded-lg",
                      valuesVisible 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 translate-y-[30px]"
                    )}
                    style={{ 
                      transitionDelay: `${index * 600}ms`,
                      transitionDuration: "2000ms",
                      transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                  >
                    <div className="mt-1 text-[#339CFF] flex-shrink-0">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold mb-1">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
