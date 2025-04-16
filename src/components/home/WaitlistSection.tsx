
import { WaitlistForm } from "@/components/waitlist-form";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export function WaitlistSection() {
  return (
    <section 
      id="waitlist" 
      className="py-20 md:py-32 bg-accent/50"
      aria-labelledby="waitlist-heading"
    >
      <ResponsiveContainer className="max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 
            id="waitlist-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Join the Waitlist Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Be among the first to experience the future of accounting memo creation.
            Limited spots available for our beta program.
          </p>
          <div className="w-full max-w-md">
            <WaitlistForm />
          </div>
        </div>
      </ResponsiveContainer>
    </section>
  );
}
