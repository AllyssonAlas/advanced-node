import { mock, MockProxy } from 'jest-mock-extended';

import { FacebookApi } from '@/infra/apis';
import { HttpGetClient } from '@/infra/http';

describe('FacebookApi', () => {
  let clientId: string;
  let clientSecret: string;
  let sut: FacebookApi;
  let httpClient: MockProxy<HttpGetClient>;

  beforeAll(() => {
    clientId = 'any_client_id';
    clientSecret = 'any_client_secret';
    httpClient = mock();
  });

  beforeEach(() => {
    httpClient.get.mockResolvedValueOnce({ access_token: 'any_app_token' });
    sut = new FacebookApi(httpClient, clientId, clientSecret);
  });

  it('Should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
  });

  it('Should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' });

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token',
      },
    });
  });
});