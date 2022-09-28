import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { AccessToken, FacebookAccount } from '@/domain/entities';
import { AuthenticationError } from '@/domain/entities/errors';
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/usecases';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/domain/contracts/repositories';
import { LoadFacebookUserApi } from '@/domain/contracts/apis';
import { TokenGenerator } from '@/domain/contracts/crypto';

jest.mock('@/domain/entities/facebook-account');

describe('FacebookAuthentication', () => {
  let crypto: MockProxy<TokenGenerator>;
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let facebookApi: MockProxy<LoadFacebookUserApi>;
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
    crypto.generateToken.mockResolvedValue('any_generated_token');
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

  it('Should return AuthenticationError when FacebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if LoadUserAccountRepo throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('load_error'));
  });

  it('Should call SaveFacebookAccountRepository with correct FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    mocked(FacebookAccount).mockImplementation(facebookAccountStub);

    await sut({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if SaveFacebookAccountRepository throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('save_error'));
  });

  it('Should call TokenGenerator with correct params', async () => {
    await sut({ token });

    expect(crypto.generateToken).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs,
    });
    expect(crypto.generateToken).toHaveBeenCalledTimes(1);
  });

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generateToken.mockRejectedValueOnce(new Error('token_error'));

    const promise = sut({ token });

    await expect(promise).rejects.toThrowError(new Error('token_error'));
  });

  it('Should return an AccessToken on success', async () => {
    const authResult = await sut({ token });

    expect(authResult).toEqual(new AccessToken('any_generated_token'));
  });
});
