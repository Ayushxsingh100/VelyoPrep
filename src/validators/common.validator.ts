export interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  return { isValid: true, error: null };
}

export function validateLength(
  value: string,
  fieldName: string,
  min: number = 0,
  max: number = 255
): ValidationResult {
  if (!value) return { isValid: true, error: null };
  const trimmed = value.trim();
  if (trimmed.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters.` };
  }
  if (trimmed.length > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max} characters.` };
  }
  return { isValid: true, error: null };
}

export function validateEmail(email: string): ValidationResult {
  if (!email || !email.trim()) return { isValid: false, error: "Email address is required." };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  return { isValid: true, error: null };
}

export function validateUrl(url: string, fieldName: string = "URL"): ValidationResult {
  if (!url || !url.trim()) return { isValid: true, error: null };
  try {
    new URL(url.trim());
    return { isValid: true, error: null };
  } catch {
    return { isValid: false, error: `Please enter a valid ${fieldName} format.` };
  }
}

export function validateDate(dateStr: string, fieldName: string = "Date"): ValidationResult {
  if (!dateStr || !dateStr.trim()) return { isValid: false, error: `${fieldName} is required.` };
  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) {
    return { isValid: false, error: `Invalid ${fieldName} format.` };
  }
  return { isValid: true, error: null };
}

export function validateFileFormatAndSize(
  file: File,
  allowedExtensions: string[],
  maxSizeMb: number = 10
): ValidationResult {
  if (!file) return { isValid: false, error: "No file provided for validation." };

  const ext = file.name.includes(".") ? `.${file.name.split(".").pop()?.toLowerCase()}` : "";
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
    return {
      isValid: false,
      error: `Invalid file extension (${ext}). Allowed extensions: ${allowedExtensions.join(", ")}.`,
    };
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of ${maxSizeMb}MB.`,
    };
  }

  return { isValid: true, error: null };
}
