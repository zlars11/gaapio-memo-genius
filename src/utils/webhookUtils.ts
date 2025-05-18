
// Helper functions for managing webhook URLs

/**
 * Save a webhook URL to localStorage
 * @param type The webhook type identifier
 * @param url The webhook URL to save
 */
export const saveWebhookUrl = (type: string, url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${type}WebhookUrl`, url);
    console.log(`Saved ${type} webhook URL to localStorage:`, url);
  }
};

/**
 * Get a webhook URL from localStorage
 * @param type The webhook type identifier
 * @returns The stored webhook URL or empty string
 */
export const getWebhookUrl = (type: string): string => {
  if (typeof window !== 'undefined') {
    const url = localStorage.getItem(`${type}WebhookUrl`) || '';
    console.log(`Retrieved ${type} webhook URL from localStorage:`, url);
    return url;
  }
  return '';
};

/**
 * Pre-configured webhook types
 */
export const WebhookTypes = {
  DEMO_REQUEST: 'demoRequest',
  CONTACT_FORM: 'contact',
  FIRM_SIGNUP: 'firmSignup',
  USER_SIGNUP: 'userSignup'
};

/**
 * Initialize default webhook URLs if they don't exist
 */
export const initializeDefaultWebhooks = (): void => {
  // Demo requests
  if (!getWebhookUrl(WebhookTypes.DEMO_REQUEST)) {
    saveWebhookUrl(WebhookTypes.DEMO_REQUEST, 'https://hooks.zapier.com/hooks/catch/22551110/2p1zchz/');
  }
  
  // Contact form
  if (!getWebhookUrl(WebhookTypes.CONTACT_FORM)) {
    saveWebhookUrl(WebhookTypes.CONTACT_FORM, 'https://hooks.zapier.com/hooks/catch/22551110/2xusps1/');
  }
  
  // Firm signup
  if (!getWebhookUrl(WebhookTypes.FIRM_SIGNUP)) {
    saveWebhookUrl(WebhookTypes.FIRM_SIGNUP, 'https://hooks.zapier.com/hooks/catch/22551110/2xni535/');
  }
};
