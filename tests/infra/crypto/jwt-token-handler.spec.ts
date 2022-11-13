import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    secret = 'any_secret';
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  describe('generateToken', () => {
    let key: string;
    let expirationInMs: number;
    let token: string;

    beforeAll(() => {
      key = 'any_key';
      token = 'any_token';
      expirationInMs = 1000;
      fakeJwt.sign.mockImplementation(() => token);
    });

    it('Should call sign with correct params', async () => {
      await sut.generateToken({ key, expirationInMs });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
    });

    it('Should return a token', async () => {
      const generatedToken = await sut.generateToken({ key, expirationInMs });

      expect(generatedToken).toBe(token);
    });

    it('Should rethrow if sign throws ', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error');
      });

      const promise = sut.generateToken({ key, expirationInMs });

      await expect(promise).rejects.toThrow(new Error('token_error'));
    });
  });
});
