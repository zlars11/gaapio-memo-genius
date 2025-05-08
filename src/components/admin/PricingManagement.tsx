
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, History } from "lucide-react";

interface PriceItem {
  id: string;
  name: string;
  price: number;
  product_type: string;
  tier: string;
  stripe_price_id: string;
  created_at?: string;
  updated_at?: string;
}

interface PriceHistoryItem {
  id: string;
  product_type: string;
  tier: string;
  price: number;
  effective_from: string;
}

export function PricingManagement() {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("base");
  const [activeSection, setActiveSection] = useState("current");
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

  const fetchPriceHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .order('effective_from', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setPriceHistory(data as PriceHistoryItem[]);
      }
    } catch (error) {
      console.error("Error fetching price history:", error);
      toast({
        title: "Error",
        description: "Failed to load price history",
        variant: "destructive",
      });
    } finally {
      setHistoryLoading(false);
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
      case "all": return "All Tiers";
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

  // Load price history when history tab is selected
  useEffect(() => {
    if (activeSection === "history") {
      fetchPriceHistory();
    }
  }, [activeSection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Management</CardTitle>
        <CardDescription>
          Manage product prices across different tiers
        </CardDescription>
        <div className="mt-4">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList>
              <TabsTrigger value="current">Current Prices</TabsTrigger>
              <TabsTrigger value="history">Price History</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="current">
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
                        {formatTierName(price.tier)}
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
        </TabsContent>
        
        <TabsContent value="history">
          {historyLoading ? (
            <div className="text-center py-6">Loading price history...</div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 font-medium text-sm py-2">
                <div>Product</div>
                <div>Tier</div>
                <div>Price ($/month)</div>
                <div>Effective From</div>
                <div></div>
              </div>
              {priceHistory.map((item) => (
                <div key={item.id} className="grid grid-cols-5 gap-4 items-center border-b py-3">
                  <div>{formatProductType(item.product_type)}</div>
                  <div>{formatTierName(item.tier)}</div>
                  <div>${item.price}</div>
                  <div>{formatDate(item.effective_from)}</div>
                  <div></div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          <History className="h-4 w-4 inline mr-1" /> 
          Price history is automatically tracked when prices are updated
        </div>
      </CardFooter>
    </Card>
  );
}
