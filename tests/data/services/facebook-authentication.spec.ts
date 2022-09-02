import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { FacebookAccount } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import {
  SaveFacebookAccountRepository,
  LoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

jest.mock('@/domain/models/facebook-account');

describe('FacebookAuthenticationService', () => {
  let userAccountRepo: MockProxy<LoadUserAccountRepository & SaveFacebookAccountRepository>;
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    userAccountRepo = mock();
    userAccountRepo.load.mockResolvedValue(undefined);
    facebookApi = mock();
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepo);
  });

  it('Should call FacebookApi with correct params', async () => {
    await sut.perform({ token });

    expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
  });

  it('Should return AuthenticationError when FacebookApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined);

    const authResult = await sut.perform({ token });

    expect(authResult).toEqual(new AuthenticationError());
  });

  it('Should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token });

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' });
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1);
  });

  it('Should call SaveFacebookAccountRepository with correct FacebookAccount', async () => {
    const facebookAccountStub = jest.fn().mockImplementation(() => ({ any: 'any' }));
    mocked(FacebookAccount).mockImplementation(facebookAccountStub);

    await sut.perform({ token });

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' });
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1);
  });
});
