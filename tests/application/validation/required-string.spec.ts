import { RequiredString } from '@/application/validation';
import { RequiredFieldError } from '@/application/errors';

describe('RequiredString', () => {
  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return RequiredFieldError if value is null', () => {
    const sut = new RequiredString(null as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredString(undefined as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return undefined if value is valid', () => {
    const sut = new RequiredString('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
