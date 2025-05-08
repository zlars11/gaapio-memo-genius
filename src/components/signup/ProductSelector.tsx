
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductSelectorProps {
  selectedProduct: string;
  onSelectProduct: (product: string) => void;
  selectedTier: string;
}

export function ProductSelector({ selectedProduct, onSelectProduct, selectedTier }: ProductSelectorProps) {
  // Function to get user limit based on tier
  const getUserLimit = (tier: string) => {
    if (tier === "enterprise") return "Unlimited users";
    if (tier === "mid") return "Up to 6 users";
    return "Up to 3 users";
  };

  // Function to check if audit package is included based on tier
  const hasAuditPackage = (tier: string) => {
    return tier === "mid" || tier === "enterprise";
  };

  const products = [
    {
      id: "memos",
      title: "Memos",
      description: "AI-generated accounting memos",
    },
    {
      id: "disclosures",
      title: "Disclosures",
      description: "AI-generated financial disclosures",
    },
    {
      id: "bundle",
      title: "Both (Bundle)",
      description: "AI-generated memos and disclosures",
      popular: true,
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 2: Select Your Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className={cn(
              "cursor-pointer transition-all",
              selectedProduct === product.id 
                ? "border-primary shadow-md" 
                : "hover:border-primary/50",
              product.popular ? "border-primary/50" : ""
            )}
            onClick={() => onSelectProduct(product.id)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {product.title}
                {selectedProduct === product.id && (
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                )}
                {product.popular && (
                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Best Value</span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>{getUserLimit(selectedTier)}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Unlimited {product.id === "bundle" 
                    ? "AI-generated memos and disclosures" 
                    : `AI-generated ${product.id}`}</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Internal approvals</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                  <span>Version history</span>
                </li>
                {hasAuditPackage(selectedTier) && (
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>Audit package</span>
                  </li>
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant={selectedProduct === product.id ? "default" : "outline"} 
                className="w-full"
                onClick={() => onSelectProduct(product.id)}
              >
                {selectedProduct === product.id ? "Selected" : "Select"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
