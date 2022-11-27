import { Required, RequiredString } from '@/application/validation';
import { RequiredFieldError } from '@/application/errors';

describe('Required', () => {
  it('Should return RequiredFieldError if value is null', () => {
    const sut = new Required(null as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return RequiredFieldError if value is undefined', () => {
    const sut = new Required(undefined as any, 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return undefined if value is valid', () => {
    const sut = new Required('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});

describe('RequiredString', () => {
  it('Should extend Required', () => {
    const sut = new RequiredString('');

    expect(sut).toBeInstanceOf(Required);
  });

  it('Should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredString('', 'any_field');

    const error = sut.validate();

    expect(error).toEqual(new RequiredFieldError('any_field'));
  });

  it('Should return undefined if value is valid', () => {
    const sut = new RequiredString('any_value', 'any_field');

    const error = sut.validate();

    expect(error).toBeUndefined();
  });
});
