import { AllowedMimeTypes } from '@/application/validation';
import { InvalidMimeTypeError } from '@/application/errors';

describe('AllowedMimeTypes', () => {
  it('Should return InvalidMimeTypeError if value is invalid', () => {
    const sut = new AllowedMimeTypes(['png'], 'image/jpg');

    const error = sut.validate();

    expect(error).toEqual(new InvalidMimeTypeError(['png']));
  });
});
