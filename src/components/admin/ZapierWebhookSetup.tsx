
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveWebhookUrl, getWebhookUrl } from "@/utils/webhookUtils";

interface ZapierWebhookSetupProps {
  webhookType: string;
  description: string;
}

export function ZapierWebhookSetup({ webhookType, description }: ZapierWebhookSetupProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load the webhook URL when component mounts
    const savedUrl = getWebhookUrl(webhookType);
    setWebhookUrl(savedUrl);
  }, [webhookType]);

  const handleSaveWebhook = () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save webhook URL to localStorage using our utility
      saveWebhookUrl(webhookType, webhookUrl);
      
      toast({
        title: "Webhook updated",
        description: "Your Zapier webhook has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save webhook URL",
        variant: "destructive",
      });
    }
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const testPayload = {
        event: "test",
        timestamp: new Date().toISOString(),
        source: "admin_dashboard",
      };

      console.log("Sending test to webhook:", webhookUrl);

      // Since we're using no-cors, we won't get a proper response status
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(testPayload),
      });

      toast({
        title: "Test sent",
        description: "A test notification was sent to your Zapier webhook",
      });
    } catch (error) {
      console.error("Error sending test to webhook:", error);
      toast({
        title: "Error",
        description: "Failed to send test to webhook",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Zapier Integration</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full gap-4">
          <div className="grid gap-2">
            <label htmlFor="webhook-url" className="text-sm font-medium">
              Zapier Webhook URL
            </label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={handleSaveWebhook}>
                Save
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter your Zapier webhook URL to connect your form submissions
            </p>
          </div>
          
          <div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleTestWebhook}
              disabled={isLoading || !webhookUrl}
            >
              {isLoading ? "Sending..." : "Send Test"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
