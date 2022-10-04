import { mock, MockProxy } from 'jest-mock-extended';

import { setupAuthorize, Authorize } from '@/domain/usecases';
import { TokenValidator } from '@/domain/contracts/crypto';

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>;
  let sut: Authorize;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    crypto = mock();
    crypto.validateToken.mockResolvedValue('any_value');
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token });

    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });

  it('Should return the correct accessToken', async () => {
    const userId = await sut({ token });

    expect(userId).toBe('any_value');
  });
});
