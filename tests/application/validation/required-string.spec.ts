import { RequiredStringValidator } from '@/application/validation';
import { RequiredFieldError } from '@/application/errors';

describe('RequiredStringValidator', () => {
  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidator('', 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidator(null as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidator(undefined as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return undefined if value is valid', () => {
    const sut = new RequiredStringValidator('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
