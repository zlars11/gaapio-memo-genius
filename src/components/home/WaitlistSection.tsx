
import { WaitlistForm } from "@/components/waitlist-form";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";

export function WaitlistSection() {
  return (
    <section 
      id="waitlist" 
      className="py-16 md:py-24 lg:py-32 px-4 sm:px-6"
      aria-labelledby="waitlist-heading"
    >
      <ResponsiveContainer className="max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <h2 
            id="waitlist-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4"
          >
            Join the Waitlist Today
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl">
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
