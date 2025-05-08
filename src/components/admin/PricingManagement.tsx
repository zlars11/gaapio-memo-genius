
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check } from "lucide-react";

interface PriceItem {
  id: string;
  name: string;
  price: number;
  product_type: string;
  tier: string;
}

export function PricingManagement() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("base");
  const { toast } = useToast();

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_prices')
        .select('*')
        .order('product_type', { ascending: true })
        .order('tier', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setPrices(data as PriceItem[]);
      }
    } catch (error) {
      console.error("Error fetching prices:", error);
      toast({
        title: "Error",
        description: "Failed to load pricing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = (id: string, value: number) => {
    setPrices(prices.map(price => 
      price.id === id ? { ...price, price: value } : price
    ));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      for (const price of prices) {
        const { error } = await supabase
          .from('product_prices')
          .update({ price: price.price })
          .eq('id', price.id);
        
        if (error) throw new Error(error.message);
      }
      
      toast({
        title: "Success",
        description: "Prices updated successfully",
      });
    } catch (error) {
      console.error("Error updating prices:", error);
      toast({
        title: "Error",
        description: "Failed to update prices",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatTierName = (tier: string) => {
    switch(tier) {
      case "emerging": return "Emerging";
      case "midMarket": return "Mid-Market";
      case "enterprise": return "Enterprise";
      default: return tier;
    }
  };

  const formatProductType = (type: string) => {
    switch(type) {
      case "memos": return "Memos";
      case "disclosures": return "Disclosures";
      case "bundle": return "Bundle";
      case "addon_disclosure": return "Add-On: Disclosures";
      case "addon_cpa": return "Add-On: CPA Review";
      default: return type;
    }
  };

  const getBaseProducts = () => {
    return prices.filter(p => 
      ["memos", "disclosures", "bundle"].includes(p.product_type)
    );
  };

  const getAddons = () => {
    return prices.filter(p => 
      p.product_type.startsWith("addon_")
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Management</CardTitle>
        <CardDescription>
          Manage product prices across different tiers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="base">Base Products</TabsTrigger>
            <TabsTrigger value="addons">Add-Ons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="base" className="space-y-4">
            {loading ? (
              <div className="text-center py-6">Loading pricing data...</div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 font-medium text-sm py-2">
                  <div>Product</div>
                  <div>Tier</div>
                  <div>Price ($/month)</div>
                  <div></div>
                </div>
                {getBaseProducts().map((price) => (
                  <div key={price.id} className="grid grid-cols-4 gap-4 items-center border-b py-3">
                    <div>{formatProductType(price.product_type)}</div>
                    <div>{formatTierName(price.tier)}</div>
                    <div>
                      <Input
                        type="number"
                        value={price.price}
                        onChange={(e) => updatePrice(price.id, parseFloat(e.target.value))}
                        className="max-w-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="addons" className="space-y-4">
            {loading ? (
              <div className="text-center py-6">Loading pricing data...</div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-4 font-medium text-sm py-2">
                  <div>Add-On</div>
                  <div>Tier</div>
                  <div>Price ($/month)</div>
                  <div></div>
                </div>
                {getAddons().map((price) => (
                  <div key={price.id} className="grid grid-cols-4 gap-4 items-center border-b py-3">
                    <div>{formatProductType(price.product_type)}</div>
                    <div>
                      {price.tier === 'all' ? 'All Tiers' : formatTierName(price.tier)}
                    </div>
                    <div>
                      <Input
                        type="number"
                        value={price.price}
                        onChange={(e) => updatePrice(price.id, parseFloat(e.target.value))}
                        className="max-w-[120px]"
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={saveChanges} 
            disabled={loading || saving}
            className="flex gap-2"
          >
            {saving ? "Saving..." : "Save Changes"}
            {!saving && <Check className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
