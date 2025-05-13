
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
      features: ["Up to 3 users", "Version history", "Internal workflows"]
    },
    {
      id: "mid",
      title: "Mid-Market",
      features: ["Up to 6 users", "Version history", "Internal workflows", "Audit package"]
    },
    {
      id: "enterprise",
      title: "Enterprise",
      features: ["Unlimited users", "Version history", "Internal workflows", "Audit package", "Compliance updates and training"]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Select Your Company Size</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={cn(
              "cursor-pointer transition-all h-full flex flex-col",
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
              
              <div className="mt-3">
                <div className="text-sm text-muted-foreground">
                  {tier.features[0]}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {tier.features.slice(1).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
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
