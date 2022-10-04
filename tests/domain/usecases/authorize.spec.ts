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
  });

  beforeEach(() => {
    sut = setupAuthorize(crypto);
  });

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token });

    expect(crypto.validateToken).toHaveBeenCalledWith({ token });
    expect(crypto.validateToken).toHaveBeenCalledTimes(1);
  });
});
