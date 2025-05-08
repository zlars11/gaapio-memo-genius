
import { cn } from "@/lib/utils";

interface StepProps {
  number: number;
  title: string;
  active: boolean;
}

export function StepIndicator({ number, title, active }: StepProps) {
  return (
    <div className="flex items-center">
      <div 
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium mr-3",
          active 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        )}
      >
        {number}
      </div>
      <span className={cn(
        "font-medium",
        active ? "text-foreground" : "text-muted-foreground"
      )}>
        {title}
      </span>
    </div>
  );
}

interface GuidedFlowStepsProps {
  currentStep: number;
}

export function GuidedFlowSteps({ currentStep }: GuidedFlowStepsProps) {
  const steps = [
    { number: 1, title: "Select Your Tier" },
    { number: 2, title: "Select Your Product" },
    { number: 3, title: "Add-Ons (Optional)" },
    { number: 4, title: "Order Summary" }
  ];

  return (
    <div className="space-y-3 md:space-y-0 md:flex md:items-center md:justify-between md:space-x-8 bg-muted/30 p-4 rounded-lg mb-8">
      {steps.map((step) => (
        <StepIndicator
          key={step.number}
          number={step.number}
          title={step.title}
          active={currentStep >= step.number}
        />
      ))}
    </div>
  );
}
