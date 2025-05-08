
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type PriceHistoryEntry = {
  id: string;
  product_type: string;
  tier: string;
  price: number;
  effective_from: string;
  created_at: string;
};

export function PriceHistoryViewer() {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPriceHistory() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("price_history")
          .select("*")
          .order("effective_from", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        setPriceHistory(data as PriceHistoryEntry[]);
      } catch (err: any) {
        setError(err.message || "Failed to load price history data");
        console.error("Error fetching price history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPriceHistory();
  }, []);

  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format product type for display
  const formatProductType = (productType: string) => {
    return productType.charAt(0).toUpperCase() + productType.slice(1);
  };

  // Format tier for display
  const formatTier = (tier: string) => {
    if (tier === "midMarket") return "Mid-Market";
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Safely format date as distance from now
  const safeFormatDistanceToNow = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Unknown date";
      }
      
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      console.error("Error formatting date:", err, dateString);
      return "Date format error";
    }
  };
  
  // Safely format date for display
  const safeFormatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      return date.toLocaleString();
    } catch (err) {
      console.error("Error formatting date:", err, dateString);
      return "Date format error";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error loading price history</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (priceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">No price history records found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Change History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Effective From</TableHead>
                <TableHead>Changed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{formatProductType(entry.product_type)}</TableCell>
                  <TableCell>{formatTier(entry.tier)}</TableCell>
                  <TableCell>{formatCurrency(entry.price)}</TableCell>
                  <TableCell>{safeFormatDate(entry.effective_from)}</TableCell>
                  <TableCell>{safeFormatDistanceToNow(entry.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
