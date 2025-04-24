
export function validateCardNumber(cardNumber: string): boolean {
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  // Check if card number length is valid (13-19 digits)
  if (digits.length < 13 || digits.length > 19) {
    return false;
  }
  
  // Luhn algorithm for credit card validation
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    
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

export function validateExpiryDate(expiryDate: string): boolean {
  // Check MM/YY format
  const regexMatch = expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/);
  if (!regexMatch) {
    return false;
  }
  
  const month = parseInt(regexMatch[1]);
  const year = parseInt(`20${regexMatch[2]}`);
  
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
  const currentYear = now.getFullYear();
  
  // Check if the card is not expired
  return (year > currentYear || (year === currentYear && month >= currentMonth));
}

export function validateCVV(cvv: string): boolean {
  // CVV must be 3 or 4 digits
  const digits = cvv.replace(/\D/g, '');
  return /^[0-9]{3,4}$/.test(digits);
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim()
    .slice(0, 19);
}

export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, '');
  let formatted = digits;
  
  // Format as MM/YY
  if (digits.length > 2) {
    formatted = `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  }
  
  return formatted;
}
