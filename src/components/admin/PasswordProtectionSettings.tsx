
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PasswordProtectionSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password Protection</CardTitle>
        <CardDescription>
          Password protection has been permanently disabled for this website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
          <p className="font-medium mb-2">Feature Disabled</p>
          <p>
            The password protection functionality has been completely removed from this website. 
            The site is now fully accessible to all visitors without requiring a password.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
