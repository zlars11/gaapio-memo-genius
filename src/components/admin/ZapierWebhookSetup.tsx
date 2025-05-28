
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ZapierWebhookSetupProps {
  webhookType: string;
  description: string;
}

export function ZapierWebhookSetup({ webhookType, description }: ZapierWebhookSetupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>Email notifications are now handled automatically via Formsubmit</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Zapier integration has been removed. Form submissions now automatically send email notifications 
            to zack@gaapio.com and jace@gaapio.com via Formsubmit without requiring any configuration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
