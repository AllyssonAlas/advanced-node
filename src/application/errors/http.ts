export class ServerError extends Error {
  constructor(error?: Error) {
    super('Server failed. Try again later');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`);
    this.name = 'RequiredFieldError';
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super('Access denied');
    this.name = 'ForbiddenError';
  }
}

export class InvalidMimeTypeError extends Error {
  constructor(allowed: string[]) {
    super(`Unsupported type. Allowed types: ${allowed.join(', ')}}.`);
    this.name = 'InvalidMimeTypeError';
  }
}

export class MaxFileSizeError extends Error {
  constructor(maxSizeInMB: number) {
    super(`File upload limit size is ${maxSizeInMB}MB`);
    this.name = 'MaxFileSizeError';
  }
}
