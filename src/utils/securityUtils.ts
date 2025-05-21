
/**
 * Security utility functions for the application
 */

// Cookie management functions
function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
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
  document.cookie = `${name}=;Max-Age=-99999999;path=/`;
}

// Password protection functions with fallbacks to localStorage for backward compatibility
export function getProtectionStatus(): boolean {
  // First check cookie, then localStorage for backward compatibility
  const cookieValue = getCookie('password_protection_enabled');
  if (cookieValue !== null) {
    return cookieValue === 'true';
  }
  
  // Fallback to localStorage
  const localValue = localStorage.getItem('password_protection_enabled');
  if (localValue !== null) {
    // Migrate from localStorage to cookie
    setCookie('password_protection_enabled', localValue);
    return localValue === 'true';
  }
  
  return false;
}

export function setProtectionStatus(enabled: boolean): void {
  // Set in both cookie and localStorage for backward compatibility
  setCookie('password_protection_enabled', enabled.toString());
  localStorage.setItem('password_protection_enabled', enabled.toString());
}

export function getSitePassword(): string | null {
  // First check cookie, then localStorage for backward compatibility
  const cookieValue = getCookie('site_password');
  if (cookieValue !== null) {
    return cookieValue;
  }
  
  // Fallback to localStorage
  const localValue = localStorage.getItem('site_password');
  if (localValue) {
    // Migrate from localStorage to cookie
    setCookie('site_password', localValue);
    return localValue;
  }
  
  return null;
}

export function setSitePassword(password: string): void {
  // Set in both cookie and localStorage for backward compatibility
  setCookie('site_password', password);
  localStorage.setItem('site_password', password);
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
  // Check if access is granted via cookie
  const accessCookie = getCookie('site_access');
  if (accessCookie) {
    try {
      const accessData = JSON.parse(accessCookie);
      const { granted, expires, version } = accessData;
      
      // Check if access is granted, not expired, and version matches
      const currentTime = Date.now();
      const isExpired = expires <= currentTime;
      const currentVersion = getSessionVersion();
      const isVersionMatch = version === currentVersion;
      
      return granted && !isExpired && isVersionMatch;
    } catch (e) {
      console.error("Error parsing access cookie:", e);
      return false;
    }
  }
  
  // Fallback to sessionStorage for backward compatibility
  const accessSession = sessionStorage.getItem('site_access');
  if (accessSession) {
    try {
      const accessData = JSON.parse(accessSession);
      const { granted, expires, version } = accessData;
      
      // Check if access is granted, not expired, and version matches
      const currentTime = Date.now();
      const isExpired = expires <= currentTime;
      const currentVersion = getSessionVersion();
      const isVersionMatch = version === currentVersion;
      
      // Migrate to cookie if valid
      const isValid = granted && !isExpired && isVersionMatch;
      if (isValid) {
        setCookie('site_access', accessSession, 1); // 1 day expiry for cookie
      }
      
      return isValid;
    } catch (e) {
      console.error("Error parsing access data from session storage:", e);
      return false;
    }
  }
  
  return false;
}

export async function validateSitePassword(password: string): Promise<boolean> {
  // Check if protection is enabled
  const protectionEnabled = getProtectionStatus();
  if (!protectionEnabled) {
    // If protection is disabled, grant access
    grantAccess();
    return true;
  }

  // Check password
  const sitePassword = getSitePassword();
  const isValid = password === sitePassword;
  
  if (isValid) {
    grantAccess();
  }
  
  return isValid;
}

export function grantAccess(): void {
  // Set access with 24-hour expiry
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const currentVersion = getSessionVersion();
  
  const accessData = {
    granted: true,
    expires: expiry,
    version: currentVersion
  };
  
  const accessString = JSON.stringify(accessData);
  
  // Set in both cookie (primary) and sessionStorage (legacy support)
  setCookie('site_access', accessString, 1); // 1 day expiry
  sessionStorage.setItem('site_access', accessString);
}

export function expireAllSessions(): void {
  // Increment the version to invalidate all existing sessions
  incrementSessionVersion();
  
  // Also clear the access cookie directly
  eraseCookie('site_access');
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
export const loginRateLimiter = new RateLimiter(5, 60); // 5 attempts within 60 seconds
