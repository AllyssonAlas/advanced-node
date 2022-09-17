import { mock, MockProxy } from 'jest-mock-extended';

import { ValidationComposite, Validator } from '@/application/validation';

describe('ValidationComposite', () => {
  let sut: ValidationComposite;
  let validator1: MockProxy<Validator>;
  let validator2: MockProxy<Validator>;
  let validators: Validator[];

  beforeAll(() => {
    validator1 = mock<Validator>();
    validator1.validate.mockReturnValue(undefined);
    validator2 = mock<Validator>();
    validator2.validate.mockReturnValue(undefined);
    validators = [validator1, validator2];
  });

  beforeEach(() => {
    sut = new ValidationComposite(validators);
  });

  it('Should return undefined if all validators return undefined', () => {
    const error = sut.validate();

    expect(error).toBeUndefined();
  });

  it('Should return the first error', () => {
    validator1.validate.mockReturnValueOnce(new Error('error_1'));
    validator2.validate.mockReturnValueOnce(new Error('error_2'));
    const error = sut.validate();

    expect(error).toEqual(new Error('error_1'));
  });
});
