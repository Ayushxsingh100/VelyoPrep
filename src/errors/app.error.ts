/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string = "INTERNAL_ERROR", statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, code: string = "DATABASE_ERROR") {
    super(message, code, 500);
  }
}

export class StorageError extends AppError {
  constructor(message: string, code: string = "STORAGE_ERROR") {
    super(message, code, 500);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required.") {
    super(message, "AUTH_ERROR", 401);
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network operation failed.") {
    super(message, "NETWORK_ERROR", 503);
  }
}

/**
 * Maps Supabase PostgreSQL / API errors to standardized AppError instances
 */
export function mapSupabaseError(error: any, fallbackMessage: string = "Operation failed."): AppError {
  if (!error) return new AppError(fallbackMessage);

  if (error instanceof AppError) return error;

  const msg: string = error.message || error.error_description || fallbackMessage;
  const code: string = error.code || "";

  // PostgreSQL Common Error Mapping
  if (code === "23505") return new ValidationError("A record with this unique value already exists.");
  if (code === "23503") return new ValidationError("Referenced record does not exist.");
  if (code === "42501") return new AuthenticationError("Permission denied. Row Level Security policy violated.");
  if (code === "PGRST116") return new DatabaseError("Requested resource was not found.", "NOT_FOUND");

  return new AppError(msg, code || "UNKNOWN_ERROR", 500);
}
