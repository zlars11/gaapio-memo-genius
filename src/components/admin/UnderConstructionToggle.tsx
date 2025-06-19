
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { Loader2 } from "lucide-react";

export function UnderConstructionToggle() {
  const { siteConfig, loading, updating, updateUnderConstruction } = useSiteConfig();

  const handleToggle = async (checked: boolean) => {
    await updateUnderConstruction(checked);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Under Construction Mode</CardTitle>
          <CardDescription>Control site accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Under Construction Mode</CardTitle>
        <CardDescription>
          When enabled, visitors will see a "404 - Page Not Found" message instead of the website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="under-construction" 
            checked={siteConfig?.under_construction || false}
            onCheckedChange={handleToggle}
            disabled={updating}
          />
          <Label htmlFor="under-construction" className="flex items-center gap-2">
            {updating && <Loader2 className="h-4 w-4 animate-spin" />}
            Enable Under Construction Mode
          </Label>
        </div>
        
        <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <p className="font-medium mb-2">Current Status</p>
          <p>
            Site is currently <strong>{siteConfig?.under_construction ? 'under construction' : 'live'}</strong>
            {siteConfig?.under_construction && ' - visitors will see a 404 page'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
