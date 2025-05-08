
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProductSelectorProps {
  selectedProduct: string;
  onSelectProduct: (product: string) => void;
  selectedTier: string;
}

interface PriceData {
  [product: string]: {
    [tier: string]: number;
  }
}

export function ProductSelector({ selectedProduct, onSelectProduct, selectedTier }: ProductSelectorProps) {
  const [prices, setPrices] = useState<PriceData>({
    memos: { emerging: 8000, mid: 12000, enterprise: 20000 },
    disclosures: { emerging: 8000, mid: 12000, enterprise: 20000 },
    bundle: { emerging: 10000, mid: 20000, enterprise: 30000 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase
          .from('product_prices')
          .select('*');
        
        if (error) {
          console.error("Error fetching prices:", error);
        } else if (data) {
          const priceMapping: PriceData = {
            memos: { emerging: 8000, mid: 12000, enterprise: 20000 },
            disclosures: { emerging: 8000, mid: 12000, enterprise: 20000 },
            bundle: { emerging: 10000, mid: 20000, enterprise: 30000 }
          };
          
          data.forEach(item => {
            const product = item.product_type;
            const tier = item.tier === "midMarket" ? "mid" : item.tier;
            if (product && tier && priceMapping[product] && priceMapping[product][tier]) {
              priceMapping[product][tier] = item.price;
            }
          });
          
          setPrices(priceMapping);
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, []);

  const formatTierName = (tier: string) => {
    switch(tier) {
      case "emerging": return "Emerging";
      case "mid": return "Mid-Market";
      case "enterprise": return "Enterprise";
      default: return tier;
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const products = [
    {
      id: "memos",
      title: "Memos",
      features: [
        "Unlimited AI-generated technical accounting memos"
      ]
    },
    {
      id: "disclosures",
      title: "Disclosures",
      features: [
        "Unlimited AI-generated technical accounting disclosures"
      ]
    },
    {
      id: "bundle",
      title: "Bundle",
      features: [
        "Unlimited AI-generated technical accounting memos",
        "Unlimited AI-generated technical accounting disclosures",
        "Discounted bundled pricing",
        "Unified workflow"
      ]
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
                : "hover:border-primary/50"
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
              </CardTitle>
              
              <div className="mt-3 text-lg font-bold text-primary">
                {loading ? (
                  <span className="animate-pulse">Loading price...</span>
                ) : (
                  <>
                    {formatPrice(prices[product.id][selectedTier])}<span className="text-sm font-normal text-muted-foreground">/year</span>
                  </>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {formatTierName(selectedTier)} tier
              </div>
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
