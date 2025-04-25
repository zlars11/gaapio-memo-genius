
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date object or string into a string with the format MM/DD/YYYY
 */
export function formatDate(date: Date | string): string {
  if (!date) {
    return 'N/A';
  }
  
  if (typeof date === 'string') {
    // Create a new Date object from the string
    const parsedDate = new Date(date);
    
    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
    
    date = parsedDate;
  }
  
  return date.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
}
