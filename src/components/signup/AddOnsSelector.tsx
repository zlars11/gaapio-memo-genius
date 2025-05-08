
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddOnsSelectorProps {
  selectedProduct: string;
  addDisclosures: boolean;
  onAddDisclosuresChange: (value: boolean) => void;
  cpaReviewCount: number;
  onCpaReviewCountChange: (count: number) => void;
}

export function AddOnsSelector({
  selectedProduct,
  cpaReviewCount,
  onCpaReviewCountChange
}: AddOnsSelectorProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Step 3: Select Add-Ons (Optional)</h2>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* CPA Review */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-medium">CPA Review</h3>
              <p className="text-sm text-muted-foreground">
                Add professional CPA review services to your plan ($1,000 each)
              </p>
            </div>
            
            <Select 
              value={cpaReviewCount.toString()}
              onValueChange={(value) => onCpaReviewCountChange(parseInt(value))}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="0" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
