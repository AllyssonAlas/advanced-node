import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthenticationService } from '@/data/services';
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { LoadFacebookUserApi } from '@/data/contracts/apis';

describe('FacebookAuthenticationService', () => {
  let userAccountRepo: MockProxy<
    LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  >;
  let facebookApi: MockProxy<LoadFacebookUserApi>;
  let sut: FacebookAuthenticationService;
  const token = 'any_token';

  beforeEach(() => {
    userAccountRepo = mock();
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

  it('Should call CreateFacebookAccountRepo when LoadUserAcountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined);

    await sut.perform({ token });

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1);
  });

  it('Should call UpdateFacebookAccountRepo when LoadUserAcountRepo returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name',
    });

    await sut.perform({ token });

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id',
    });
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1);
  });
});
