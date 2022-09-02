import { AccessToken } from '@/domain/models';

describe('AccessToken', () => {
  it('Should create with value', () => {
    const sut = new AccessToken('any_value');

    expect(sut).toEqual({ value: 'any_value' });
  });
});
