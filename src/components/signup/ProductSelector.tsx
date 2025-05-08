
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
  const products = [
    {
      id: "memos",
      title: "Memos",
      features: ["Unlimited AI-generated memos"]
    },
    {
      id: "disclosures",
      title: "Disclosures",
      features: ["Unlimited AI-generated disclosures"]
    },
    {
      id: "bundle",
      title: "Bundle",
      features: [
        "Unlimited AI-generated memos",
        "Unlimited AI-generated disclosures"
      ],
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
              "cursor-pointer transition-all h-full flex flex-col",
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
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-primary mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                variant={selectedProduct === product.id ? "default" : "outline"} 
                className="w-full h-10"
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
