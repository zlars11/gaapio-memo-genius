
import { DemoRequestForm } from "@/components/demo/DemoRequestForm";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-16">
        <ResponsiveContainer className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Request a Demo</h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Want to see how our AI-powered accounting memo platform works? Fill out the form below
            and we'll schedule a personalized demo with you.
          </p>
          
          <div className="bg-card border rounded-lg p-8 shadow-sm">
            <DemoRequestForm />
          </div>
        </ResponsiveContainer>
      </main>
      <Footer />
    </div>
  );
}
