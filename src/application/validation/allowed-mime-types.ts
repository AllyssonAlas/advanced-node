import { InvalidMimeTypeError } from '@/application/errors';

type Extension = 'png' | 'jpg';

export class AllowedMimeTypes {
  constructor(private readonly allowed: Extension[], private readonly mimeType?: string) {}

  validate(): Error {
    return new InvalidMimeTypeError(this.allowed);
  }
}
