import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
    secret = 'any_secret';
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  it('Should call sign with correct params', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith({ key: 'any_key' }, secret, { expiresIn: 1 });
  });

  it('Should return a token', async () => {
    const token = await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    expect(token).toBe('any_token');
  });

  it('Should rethrow if sign throws ', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });

    const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    await expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
