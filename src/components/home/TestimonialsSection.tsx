
import { useState, useEffect, useRef } from "react";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useActiveTestimonials } from "@/hooks/useCustomerTestimonials";

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: testimonials, isLoading } = useActiveTestimonials();

  useEffect(() => {
    // Check feature toggle setting
    const savedToggles = localStorage.getItem("featureToggles");
    if (savedToggles) {
      const toggles = JSON.parse(savedToggles);
      const testimonialsToggle = toggles.find((toggle: any) => toggle.id === "testimonials");
      if (testimonialsToggle) {
        setIsVisible(testimonialsToggle.enabled);
      }
    }

    // Set up intersection observer for animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.6 } // Trigger when 60% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-20 md:py-32">
        <ResponsiveContainer>
          <div className="text-center">
            <p className="text-muted-foreground">Loading testimonials...</p>
          </div>
        </ResponsiveContainer>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Function to highlight specific words in the quote
  const highlightWords = (quote: string, words: string[]) => {
    if (!words.length) return <span>{quote}</span>;
    
    const parts = quote.split(new RegExp(`(${words.join('|')})`, 'gi'));
    
    return parts.map((part, i) => {
      const isHighlighted = words.some(word => 
        part.toLowerCase() === word.toLowerCase()
      );
      
      return isHighlighted ? 
        <span key={i} className="text-[#339CFF] font-medium">{part}</span> : 
        <span key={i}>{part}</span>;
    });
  };

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="py-20 md:py-32" 
      aria-labelledby="testimonials-heading"
    >
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold mb-4">Don't Just Take Our Word For It</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what industry professionals say about Gaapio.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 overflow-x-auto sm:overflow-visible">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={cn(
                "transition-all",
                inView 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-[30px]"
              )}
              style={{ 
                transitionDelay: `${index * 600}ms`,
                transitionDuration: "2000ms",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              <Card className="h-full relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                <CardContent className="p-6">
                  <div className="absolute top-2 left-3 opacity-10 text-[#339CFF]">
                    <Quote size={48} />
                  </div>
                  
                  <p className="mb-4 italic text-lg relative z-10 text-left">
                    "{highlightWords(testimonial.quote, testimonial.highlight_words || [])}"
                  </p>
                  
                  <div className="flex items-center mt-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={testimonial.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"} 
                        alt={`${testimonial.customer_name} profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{testimonial.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.customer_title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </section>
  );
}
