
import { useEffect } from "react";
import { initializeDefaultWebhooks } from "@/utils/webhookUtils";

export function InitializeWebhooks() {
  useEffect(() => {
    // Initialize default webhooks when the app loads
    initializeDefaultWebhooks();
  }, []);

  // This component doesn't render anything
  return null;
}
