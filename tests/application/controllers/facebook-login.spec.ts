import { FacebookAuthentication } from '@/domain/features';
import { FacebookLoginController } from '@/application/controllers';
import { mock } from 'jest-mock-extended';

describe('FacebookLoginController', () => {
  it('Should return 400 if token is empty', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);

    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });

  it('Should return 400 if token is null', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);

    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });

  it('Should return 400 if token is undefined', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);

    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });

  it('Should call FacebookAuthentication with correct params', async () => {
    const facebookAuth = mock<FacebookAuthentication>();
    const sut = new FacebookLoginController(facebookAuth);

    await sut.handle({ token: 'any_token' });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token: 'any_token' });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });
});
