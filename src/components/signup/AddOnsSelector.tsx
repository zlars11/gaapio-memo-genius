
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface AddOnsSelectorProps {
  selectedProduct: string;
  addDisclosures: boolean;
  onAddDisclosuresChange: (value: boolean) => void;
  cpaReviewCount: number;
  onCpaReviewCountChange: (count: number) => void;
}

export function AddOnsSelector({
  selectedProduct,
  addDisclosures,
  onAddDisclosuresChange,
  cpaReviewCount,
  onCpaReviewCountChange
}: AddOnsSelectorProps) {
  const handleCpaIncrease = () => {
    onCpaReviewCountChange(cpaReviewCount + 1);
  };

  const handleCpaDecrease = () => {
    if (cpaReviewCount > 0) {
      onCpaReviewCountChange(cpaReviewCount - 1);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 3: Add-Ons (Optional)</h2>
      <div className="space-y-4">
        {selectedProduct === "memos" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Disclosures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Add AI-generated financial disclosures to your plan
                  </p>
                  <p className="font-medium">+$300/month</p>
                </div>
                <Switch
                  checked={addDisclosures}
                  onCheckedChange={onAddDisclosuresChange}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CPA Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Add professional CPA review to your documents
                </p>
                <p className="font-medium">+$1,000 each</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCpaDecrease}
                  disabled={cpaReviewCount === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{cpaReviewCount}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCpaIncrease}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
