import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases';
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repositories';
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways';

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<LoadUserAccount & SaveFacebookAccount>;
  let facebookApi: MockProxy<LoadFacebookUser>;
  let sut: FacebookAuthentication;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' });
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    crypto = mock();
    crypto.generate.mockResolvedValue('any_generated_token');
  });

  beforeEach(() => {
    sut = setupFacebookAuthentication(facebookApi, userAccountRepo, crypto);
  });

  it('Should call FacebookApi with correct params', async () => {
    await sut({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if FacebookApi throws', async () => {
    facebookApi.loadUser.mockRejectedValueOnce(new Error('fb_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('fb_error'));
  });

  it('Should throw AuthenticationError when FacebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const promise = sut({ token });

    await expect(promise).rejects.toThrow(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if LoadUserAccountRepo throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('load_error'));
  });

  it('Should call SaveFacebookAccount with correct FacebookAccount', async () => {
    await sut({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith(
      mocked(FacebookAccount).mock.instances[0],
    );
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if SaveFacebookAccount throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('save_error'));
  });

  it('Should call TokenGenerator with correct params', async () => {
    await sut({ token });

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generate).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('token_error'));
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut({ token });

    expect(authResult).toEqual({ accessToken: 'any_generated_token' });
  });
});
