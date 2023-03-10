import jwt from 'jsonwebtoken';

import { JwtTokenHandler } from '@/infra/gateways';

jest.mock('jsonwebtoken');

describe('JwtTokenHandler', () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;
  let token: string;
  let key: string;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    secret = 'any_secret';
    key = 'any_key';
  });

  beforeEach(() => {
    sut = new JwtTokenHandler(secret);
  });

  describe('generate', () => {
    let expirationInMs: number;

    beforeAll(() => {
      expirationInMs = 1000;
      fakeJwt.sign.mockImplementation(() => token);
    });

    it('Should call sign with correct input', async () => {
      await sut.generate({ key, expirationInMs });

      expect(fakeJwt.sign).toHaveBeenCalledWith({ key }, secret, { expiresIn: 1 });
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
    });

    it('Should return a token', async () => {
      const generatedToken = await sut.generate({ key, expirationInMs });

      expect(generatedToken).toBe(token);
    });

    it('Should rethrow if sign throws ', async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error('token_error');
      });

      const promise = sut.generate({ key, expirationInMs });

      await expect(promise).rejects.toThrow(new Error('token_error'));
    });
  });

  describe('validate', () => {
    beforeAll(() => {
      fakeJwt.verify.mockImplementation(() => ({ key }));
    });

    it('Should call verify with correct input', async () => {
      await sut.validate({ token });

      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
    });

    it('Should return the key provided to sign', async () => {
      const generatedKey = await sut.validate({ token });

      expect(generatedKey).toBe(key);
    });

    it('Should throw if verify returns null ', async () => {
      fakeJwt.verify.mockImplementationOnce(() => null);

      const promise = sut.validate({ token });

      await expect(promise).rejects.toThrow();
    });
  });
});
