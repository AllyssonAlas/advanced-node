import { AccessToken } from '@/domain/entities';

describe('AccessToken', () => {
  it('Should expire in 1800000 ms', () => {
    expect(AccessToken.expirationInMs).toBe(1800000);
  });
});
