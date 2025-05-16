
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DemoRequestForm } from "@/components/demo/DemoRequestForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { useState } from "react";
import { DemoRequestSuccess } from "@/components/demo/DemoRequestSuccess";

export default function RequestDemo() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 pt-28">
        <div className="bg-gradient-to-b from-primary/5 to-transparent border-b">
          <ResponsiveContainer className="py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              {isSubmitted ? (
                <DemoRequestSuccess />
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Request a Demo
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    See how Gaapio can transform your technical accounting workflow
                  </p>
                  
                  <div className="mt-8 bg-card border rounded-lg p-6 md:p-8 shadow-sm">
                    <DemoRequestForm onSuccess={handleSubmitSuccess} />
                  </div>
                </>
              )}
            </div>
          </ResponsiveContainer>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
