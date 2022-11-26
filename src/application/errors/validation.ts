export class RequiredFieldError extends Error {
  constructor(fieldName: string) {
    super(`The field ${fieldName} is required`);
    this.name = 'RequiredFieldError';
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
