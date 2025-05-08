
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TierSelectorProps {
  selectedTier: string;
  onSelectTier: (tier: string) => void;
}

export function TierSelector({ selectedTier, onSelectTier }: TierSelectorProps) {
  // Define the tiers with their features
  const tiers = [
    {
      id: "emerging",
      title: "Emerging",
      description: "Up to 3 users",
      features: ["Version history"]
    },
    {
      id: "mid",
      title: "Mid-Market",
      description: "Up to 6 users",
      features: ["Version history", "Internal approvals"]
    },
    {
      id: "enterprise",
      title: "Enterprise",
      description: "Unlimited users",
      features: ["Version history", "Internal approvals", "Audit package"]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 1: Select Your Tier</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={cn(
              "cursor-pointer transition-all",
              selectedTier === tier.id 
                ? "border-primary shadow-md" 
                : "hover:border-primary/50"
            )}
            onClick={() => onSelectTier(tier.id)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {tier.title}
                {selectedTier === tier.id && (
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                )}
              </CardTitle>
              <p className="text-xl font-bold text-center mt-2">{tier.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant={selectedTier === tier.id ? "default" : "outline"} 
                className="w-full h-10"
                onClick={() => onSelectTier(tier.id)}
              >
                {selectedTier === tier.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
