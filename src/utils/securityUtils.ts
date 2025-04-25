
/**
 * Security utility functions for the application
 */

/**
 * Generates a random CSRF token
 * @returns A random string to be used as a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Sets a CSRF token in sessionStorage and returns it
 * @returns The generated CSRF token
 */
export function getCSRFToken(): string {
  let token = sessionStorage.getItem('csrf_token');
  
  if (!token) {
    token = generateCSRFToken();
    sessionStorage.setItem('csrf_token', token);
  }
  
  return token;
}

/**
 * Validates the format of a credit card number without storing it
 * @param cardNumber The credit card number to validate
 * @returns True if the format is valid, false otherwise
 */
export function isValidCardFormat(cardNumber: string): boolean {
  // Remove spaces and non-numeric characters
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // Check length
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm check
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input The user input string
 * @returns A sanitized version of the input
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Rate limiting class to prevent brute force attacks
 */
export class RateLimiter {
  private attempts: Record<string, { count: number, timestamp: number }> = {};
  private maxAttempts: number;
  private timeWindow: number; // in milliseconds
  
  constructor(maxAttempts = 5, timeWindowSeconds = 60) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowSeconds * 1000;
  }
  
  /**
   * Checks if an action should be rate limited
   * @param key Unique identifier for the rate limited action (e.g. IP, username)
   * @returns True if the action should be blocked, false otherwise
   */
  isLimited(key: string): boolean {
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanExpired(now);
    
    if (!this.attempts[key]) {
      this.attempts[key] = { count: 1, timestamp: now };
      return false;
    }
    
    const entry = this.attempts[key];
    
    // If within time window, check attempts
    if (now - entry.timestamp < this.timeWindow) {
      if (entry.count >= this.maxAttempts) {
        return true; // Rate limited
      } else {
        entry.count++;
        return false;
      }
    } else {
      // Reset if time window passed
      this.attempts[key] = { count: 1, timestamp: now };
      return false;
    }
  }
  
  private cleanExpired(now: number): void {
    for (const key in this.attempts) {
      if (now - this.attempts[key].timestamp > this.timeWindow) {
        delete this.attempts[key];
      }
    }
  }
  
  /**
   * Resets rate limiting counter for a key
   * @param key The key to reset
   */
  reset(key: string): void {
    delete this.attempts[key];
  }
}

// Create singleton instance for login attempts
export const loginRateLimiter = new RateLimiter(5, 60); // 5 attempts within 60 seconds
