import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  FileText, 
  ShieldCheck, 
  Award, 
  FileCode, 
  FileSearch,
  ChevronRight,
  Star,
  MapPin,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export default function AboutUs() {
  // Section refs for scroll animations
  const introRef = useRef<HTMLElement>(null);
  const expertiseRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  
  // Visibility states for animations
  const [introVisible, setIntroVisible] = useState(false);
  const [expertiseVisible, setExpertiseVisible] = useState(false);
  const [philosophyVisible, setPhilosophyVisible] = useState(false);
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  
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
    const ctaObserver = createObserver(ctaRef, setCtaVisible);

    // Cleanup observers
    return () => {
      if (introRef.current) introObserver.unobserve(introRef.current);
      if (expertiseRef.current) expertiseObserver.unobserve(expertiseRef.current);
      if (philosophyRef.current) philosophyObserver.unobserve(philosophyRef.current);
      if (timelineRef.current) timelineObserver.unobserve(timelineRef.current);
      if (valuesRef.current) valuesObserver.unobserve(valuesRef.current);
      if (ctaRef.current) ctaObserver.unobserve(ctaRef.current);
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
        {/* Intro Section - Blue background with pattern */}
        <section 
          ref={introRef}
          className="py-16 md:py-24 bg-[#f4faff] dark:bg-[#1A1F2B] relative overflow-hidden"
        >
          {/* Abstract background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/lovable-uploads/4ddb44ca-e07c-45c3-b9e4-b2e4c7fbcd41.png')] bg-repeat opacity-10"></div>
          </div>
          
          <ResponsiveContainer>
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
                <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">About Gaapio</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto dark:text-gray-300">
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
                  <div className="relative">
                    <img 
                      src="/lovable-uploads/e263b9d6-518b-411f-be9f-c36067fd9ad1.png" 
                      alt="Two CPA accountants working together" 
                      className="rounded-lg shadow-lg max-w-full h-auto z-10 relative"
                    />
                    <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-[#339CFF]/20 rounded-lg z-0"></div>
                  </div>
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
                  <p className="text-lg dark:text-gray-200">
                    With over a decade of experience in both Big 4 environments and specialized accounting consultancies,
                    we understand the pain points of technical accounting documentation. That's why we built Gaapio—a 
                    purpose-built platform that transforms how accounting teams approach technical memos and documentation.
                  </p>
                  
                  <p className="text-lg dark:text-gray-200">
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
          </ResponsiveContainer>
        </section>

        {/* Our Expertise Section */}
        <section 
          ref={expertiseRef}
          className="py-16 md:py-24 border-t border-b border-muted dark:border-gray-800 dark:bg-background"
        >
          <ResponsiveContainer>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">Our Expertise</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {expertiseItems.map((item, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4faff] dark:hover:bg-gray-800 group",
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
                    <div className="mt-1 text-[#339CFF] flex-shrink-0 p-2 rounded-full bg-[#339CFF]/10 group-hover:bg-[#339CFF]/20 transition-all">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[#339CFF] transition-colors dark:text-white">{item.title}</h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Our Philosophy Section */}
        <section 
          ref={philosophyRef}
          className="py-16 md:py-24 bg-[#f4faff] dark:bg-[#1A1F2B] border-b relative"
        >
          {/* Abstract background pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#339CFF]/5 dark:bg-[#339CFF]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#339CFF]/5 dark:bg-[#339CFF]/10 rounded-full blur-3xl"></div>
          
          <ResponsiveContainer>
            <div className="max-w-3xl mx-auto">
              <div 
                className={cn(
                  "text-left space-y-6 transition-all dark:bg-gray-800/30 dark:p-8 dark:rounded-xl",
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
                  <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Philosophy: Reliability Meets Innovation</h2>
                </div>
                
                <p className="text-lg leading-relaxed dark:text-gray-200">
                  We believe accountants deserve cutting-edge technology that doesn't sacrifice reliability. 
                  Our platform is built on the foundation of practitioner knowledge, ensuring that innovation 
                  enhances—rather than disrupts—the accounting workflow.
                </p>
                
                <p className="text-lg leading-relaxed dark:text-gray-200">
                  Having spent years in the trenches of technical accounting, we've experienced firsthand the 
                  challenges of documentation workflows. Gaapio addresses these pain points with thoughtful 
                  design informed by real accounting experience.
                </p>
                
                <p className="text-lg leading-relaxed dark:text-gray-200">
                  Our commitment to quality extends beyond our product. As CPAs ourselves, we uphold the profession's 
                  highest standards of integrity, accuracy, and excellence in everything we build.
                </p>
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Building on Experience Section - REVERTING BACK TO ORIGINAL BUT WITHOUT THE CENTER LINE */}
        <section 
          ref={timelineRef}
          className="py-16 md:py-24 border-b relative dark:bg-background dark:border-gray-800"
        >
          <ResponsiveContainer>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Building on Experience</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto dark:text-gray-300">
                  Our journey from accounting professionals to software innovators
                </p>
              </div>
              
              <div className="relative space-y-12 max-w-3xl mx-auto">
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
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-1 rounded-full bg-background dark:bg-gray-800 border group-hover:border-[#339CFF] transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-[#339CFF] flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_0_4px_rgba(51,156,255,0.2)] transition-all duration-300">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-center group-hover:text-[#339CFF] transition-colors duration-300 dark:text-white">{event.title}</h3>
                    <p className="text-muted-foreground dark:text-gray-300 text-center">{event.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>
        </section>
        
        {/* Team Values Section */}
        <section 
          ref={valuesRef}
          className="py-16 md:py-24 bg-[#f4faff] dark:bg-[#1A1F2B] relative"
        >
          {/* Abstract background graphic */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#339CFF]/5 dark:bg-[#339CFF]/10 rounded-full blur-3xl"></div>
          
          <ResponsiveContainer>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6 dark:text-white">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto dark:text-gray-300">
                  The principles that guide our work and define our approach to serving accounting professionals
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {valuesItems.map((value, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex gap-3 transition-all hover:scale-[1.02] hover:bg-[#f0f9ff] dark:hover:bg-gray-800 p-4 rounded-lg dark:bg-gray-800/50",
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
                      <Star className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-bold mb-1 dark:text-white">{value.title}</h3>
                      <p className="text-muted-foreground dark:text-gray-300">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* CTA Section */}
        <section
          ref={ctaRef}
          className="py-16 md:py-20 border-t dark:border-gray-800 dark:bg-background"
        >
          <ResponsiveContainer>
            <div 
              className={cn(
                "max-w-4xl mx-auto text-center transition-all",
                ctaVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDuration: "2000ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Ready to transform your technical accounting workflows?</h2>
              <p className="text-lg text-muted-foreground mb-8 dark:text-gray-300">
                Let us help you simplify your technical accounting workflows.
              </p>
              <Button size="lg" variant="blue" asChild>
                <Link to="/request-demo" className="flex items-center gap-2">
                  Request a Demo <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ResponsiveContainer>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
