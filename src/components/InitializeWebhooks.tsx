
import { useEffect } from 'react';
import { initializeDefaultWebhooks } from '@/utils/webhookUtils';

export function InitializeWebhooks() {
  useEffect(() => {
    // Initialize default webhook URLs when the app starts
    initializeDefaultWebhooks();
  }, []);

  // This component doesn't render anything
  return null;
}
