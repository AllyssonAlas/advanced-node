import { FacebookAuthentication } from '@/domain/features';

interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Params) => Promise<void>;
}

namespace LoadFacebookUserApi {
  export type Params = {
    token: string;
  };
}

class FacebookAuthenticationService {
  constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform(params: FacebookAuthentication.Params): Promise<void> {
    await this.loadFacebookUserApi.loadUser(params);
  }
}

class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
  token?: string;

  async loadUser(params: LoadFacebookUserApi.Params): Promise<void> {
    this.token = params.token;
  }
}

describe('FacebookAuthenticationService', () => {
  it('Should call LoadFacebookUserApi with correct params', async () => {
    const loadFacebookUserApi = new LoadFacebookUserApiSpy();
    const sut = new FacebookAuthenticationService(loadFacebookUserApi);

    await sut.perform({ token: 'any_token' });

    expect(loadFacebookUserApi.token).toBe('any_token');
  });
});
