import { AxiosHttpClient, FacebookApi } from '@/infra/apis';
import { env } from '@/main/config/env';

describe('Facebook Api Integration Tests', () => {
  it('Should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );

    const fbUser = await sut.loadUser({
      token:
        'EAAYcfMTjiLMBAMgS6IW1ECAjYUBvZCVEeNrBa0E8q5BJDMkrOeVflrxIuPvUEvtKP8tBL6617k0o9AfRWXzL0zIONNDq7ZClZCyWBOnVkROgn4Af2US34mHYme6ExMKdlbm8O87fH0YCIooYBNZBfMGcU2G6IZCpEandTqT4grzSWoJGexMqzZBZAi1jpIenxfnXWegAMe0bQZDZD',
    });

    expect(fbUser).toEqual({
      facebookId: '101323682750015',
      name: 'Advanced Tester',
      email: 'advanced_hzlbxvx_tester@tfbnw.net',
    });
  });

  it('Should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient();
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret,
    );

    const fbUser = await sut.loadUser({ token: 'invalid_token' });

    expect(fbUser).toBeUndefined();
  });
});
