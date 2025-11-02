// Form validation utility functions

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate required field
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
}

/**
 * Validate minimum length
 */
export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  if (!value || value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true };
}

/**
 * Validate maximum length
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be no more than ${maxLength} characters` };
  }
  return { isValid: true };
}

/**
 * Validate date is in the future
 */
export function validateFutureDate(date: Date | string | null, fieldName: string): ValidationResult {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  const dateObj = new Date(date);
  if (dateObj < new Date()) {
    return { isValid: false, error: `${fieldName} must be in the future` };
  }
  return { isValid: true };
}

/**
 * Validate date range (end date after start date)
 */
export function validateDateRange(startDate: Date | string | null, endDate: Date | string | null): ValidationResult {
  if (!startDate || !endDate) {
    return { isValid: true }; // Allow empty dates
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end < start) {
    return { isValid: false, error: 'End date must be after start date' };
  }
  return { isValid: true };
}

/**
 * Validate URL format
 */
export function validateUrl(url: string): ValidationResult {
  if (!url) {
    return { isValid: true }; // URL is optional
  }
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: string): string {
  return error.charAt(0).toUpperCase() + error.slice(1);
}

/**
 * Validate multiple fields
 */
export function validateFields(
  fields: Record<string, any>,
  validators: Record<string, (value: any) => ValidationResult>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  Object.entries(validators).forEach(([fieldName, validator]) => {
    const result = validator(fields[fieldName]);
    if (!result.isValid && result.error) {
      errors[fieldName] = result.error;
    }
  });
  
  return errors;
}

/**
 * Check if form has errors
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}
