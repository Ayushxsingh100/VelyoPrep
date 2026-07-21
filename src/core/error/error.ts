/**
 * VeyloPrep Core Exception Abstractions
 */

export abstract class BaseAppException extends Error {
  abstract readonly code: string;
  readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NetworkException extends BaseAppException {
  readonly code = "NETWORK_ERROR";
  constructor(message: string = "Network request failed", statusCode: number = 503) {
    super(message, statusCode);
  }
}

export class AuthException extends BaseAppException {
  readonly code = "AUTH_ERROR";
  constructor(message: string = "Authentication failed", statusCode: number = 401) {
    super(message, statusCode);
  }
}

export class ValidationException extends BaseAppException {
  readonly code = "VALIDATION_ERROR";
  constructor(message: string = "Validation failed", statusCode: number = 400) {
    super(message, statusCode);
  }
}

export class NotFoundException extends BaseAppException {
  readonly code = "NOT_FOUND";
  constructor(message: string = "Resource not found", statusCode: number = 404) {
    super(message, statusCode);
  }
}
