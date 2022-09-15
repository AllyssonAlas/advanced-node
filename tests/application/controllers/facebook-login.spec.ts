import { mock, MockProxy } from 'jest-mock-extended';

import { AccessToken } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookLoginController } from '@/application/controllers';
import { ServerError } from '@/application/errors';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;

  beforeAll(() => {
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should return 400 if token is empty', async () => {
    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('Should return 400 if token is null', async () => {
    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('Should return 400 if token is undefined', async () => {
    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The field token is required'),
    });
  });

  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('Should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token: 'any_token' });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError(),
    });
  });

  it('Should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token: 'any_value' });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value',
      },
    });
  });

  it('Should return 500 if FacebookAuthentication throws', async () => {
    const error = new Error('infra_error');
    facebookAuth.perform.mockRejectedValueOnce(error);
    const httpResponse = await sut.handle({ token: 'any_value' });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});