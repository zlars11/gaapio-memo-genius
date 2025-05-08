
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
      
      <main className="flex-1 pt-20" id="about-content">
        <section className="py-16 md:py-24 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Gaapio is bringing simplicity back to accounting</h1>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">We're crafting the tools for teams that care about accounting experience and quality</h2>
                </div>
                
                <div className="space-y-6">
                  <p className="text-lg">
                    Accounting used to be simple: research, analyze, and document. But complexity has increased with 
                    regulations, distributed teams, and growing audit scope that slows down client and auditor satisfaction.
                  </p>
                  
                  <p className="text-lg">
                    Frustrated with this reality, we decided to build something better. Something that 
                    accounting teams would enjoy using. We named it Gaapio to signify that accounting documentation 
                    should work for you, not against you.
                  </p>
                  
                  <p className="text-lg">
                    What is Gaapio? It's not just another accounting tool. It's a purposefully designed 
                    workspace that transforms the entire technical memo process. Teams get clear, purpose-built
                    documentation that feels more like a guided conversation than a tedious form to populate.
                    Accountants get AI tools that match, organize, and produce a final draft of their
                    accounting memos—automatically. It's not just a better accounting platform, it's a better way
                    to work together.
                  </p>
                  
                  <p className="text-lg">
                    Today, forward-thinking teams use Gaapio to accelerate their accounting documentation and truly 
                    enjoy the process. And behind every streamlined workflow, every clean submission, and every
                    time-saving review, there's a simple goal: to make accounting feel simple again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-b">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">We care deeply about the quality of our work</h2>
                  
                  <p className="text-lg mb-6">
                    Gaapio is a purpose-led company founded by CPAs with Big 4 backgrounds. We are distributed
                    but our customers are all over the world. Our relentless pursuit of excellence, fast iteration, 
                    and passion for impact is what unites us.
                  </p>
                  
                  <p className="text-lg">
                    We are builders at our core and care deeply about the experience of our customers and their clients
                    down to the smallest pixel.
                  </p>
                </div>
                
                <div className="rounded-xl overflow-hidden border">
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

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center">Backed by the best</h2>
              
              <p className="text-lg text-center mb-16">
                We are grateful to work with some of the best investors in innovation. Our backers include highly 
                accomplished venture firms, product builders, and accounting professionals.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center p-4">
                  <div className="h-12 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                    <div className="bg-gray-200 h-full w-32 rounded"></div>
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
