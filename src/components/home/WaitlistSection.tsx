
import { WaitlistForm } from "@/components/waitlist-form";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Waitlist Today
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be among the first to experience the future of accounting memo creation.
            Limited spots available for our beta program.
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
