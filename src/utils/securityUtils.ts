/**
 * Security utility functions for the application
 */

// Cookie management functions with enhanced security
function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  // Get the current domain
  const domain = window.location.hostname;
  // Don't set domain for localhost to allow testing
  const domainAttr = domain === 'localhost' ? '' : `domain=${domain};`;
  
  // Enhanced cookie security:
  // - httpOnly is omitted for cookies we need to access in JS
  // - Secure flag added for HTTPS (skipped on localhost for testing)
  // - SameSite=Strict for better security
  const secureFlag = window.location.protocol === 'https:' ? 'Secure;' : '';
  
  document.cookie = `${name}=${value};${expires};path=/;${domainAttr}SameSite=Strict;${secureFlag}`;
}

function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name: string) {
  // Get the current domain
  const domain = window.location.hostname;
  // Don't set domain for localhost to allow testing
  const domainAttr = domain === 'localhost' ? '' : `domain=${domain};`;
  
  document.cookie = `${name}=;Max-Age=-99999999;path=/;${domainAttr}SameSite=Strict;`;
}

// Password protection functions - DISABLED
export function getProtectionStatus(): boolean {
  // Always return false - password protection is disabled
  return false;
}

export function setProtectionStatus(enabled: boolean): void {
  // Always set to false regardless of input - password protection is disabled
  setCookie('password_protection_enabled', 'false');
  localStorage.setItem('password_protection_enabled', 'false');
}

export function getSitePassword(): string | null {
  // Always return null - no password functionality
  return null;
}

export function setSitePassword(password: string): void {
  // Do nothing - password functionality is disabled
}

// Session version management for expiring sessions
export function getSessionVersion(): string {
  const cookieValue = getCookie('session_version');
  if (cookieValue !== null) {
    return cookieValue;
  }
  
  // Fallback to localStorage
  const localValue = localStorage.getItem('session_version') || '0';
  // Migrate to cookie
  setCookie('session_version', localValue);
  return localValue;
}

export function incrementSessionVersion(): string {
  const currentVersion = parseInt(getSessionVersion() || '0');
  const newVersion = (currentVersion + 1).toString();
  
  // Update in both cookie and localStorage
  setCookie('session_version', newVersion);
  localStorage.setItem('session_version', newVersion);
  
  return newVersion;
}

export function hasValidAccess(): boolean {
  // Always return true - no password protection
  return true;
}

export async function validateSitePassword(password: string): Promise<boolean> {
  // Always return true - no password protection
  return true;
}

export function grantAccess(): void {
  // Do nothing - access is always granted
}

export function expireAllSessions(): void {
  // Only increment version for admin session management
  incrementSessionVersion();
}

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
export const loginRateLimiter = new RateLimiter(5, 60);
