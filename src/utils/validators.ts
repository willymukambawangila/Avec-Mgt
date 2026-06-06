/**
 * Common validation utilities
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate strong password
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate ZIP/Postal code
 */
export const isValidZipCode = (zipCode: string, country: string = 'US'): boolean => {
  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    UK: /^[A-Z]{1,2}[\dR][A-Z\d]?\s?[\dA-Z]{2}$/i,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  };

  const pattern = patterns[country];
  return pattern ? pattern.test(zipCode) : false;
};

/**
 * Validate credit card number (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate SSN format
 */
export const isValidSSN = (ssn: string): boolean => {
  const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  return ssnRegex.test(ssn);
};

/**
 * Validate date string
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Validate date is in future
 */
export const isFutureDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) > new Date();
};

/**
 * Validate date is in past
 */
export const isPastDate = (dateString: string): boolean => {
  if (!isValidDate(dateString)) return false;
  return new Date(dateString) < new Date();
};

/**
 * Validate minimum age
 */
export const isMinimumAge = (birthDate: string, minimumAge: number): boolean => {
  if (!isValidDate(birthDate)) return false;
  const today = new Date();
  const age = today.getFullYear() - new Date(birthDate).getFullYear();
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth();

  return age > minimumAge || (age === minimumAge && monthDiff >= 0);
};

/**
 * Validate string is not empty
 */
export const isNotEmpty = (str: string | null | undefined): boolean => {
  return typeof str === 'string' && str.trim().length > 0;
};

/**
 * Validate string length
 */
export const isValidLength = (str: string, min: number, max: number): boolean => {
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Validate number range
 */
export const isInRange = (num: number, min: number, max: number): boolean => {
  return num >= min && num <= max;
};

/**
 * Validate array has items
 */
export const isNotEmptyArray = (arr: unknown[]): boolean => {
  return Array.isArray(arr) && arr.length > 0;
};

/**
 * Sanitize string input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potential HTML/script tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate object has required fields
 */
export const hasRequiredFields = (
  obj: Record<string, unknown>,
  requiredFields: string[]
): boolean => {
  return requiredFields.every((field) => field in obj && obj[field] !== null && obj[field] !== undefined);
};

/**
 * Validate enum value
 */
export const isValidEnumValue = (value: unknown, enumObj: Record<string, string | number>): boolean => {
  return Object.values(enumObj).includes(value as string | number);
};
