import { AuthenticationError } from '@/domain/entities/errors';
import { Controller, FacebookLoginController } from '@/application/controllers';
import { UnauthorizedError } from '@/application/errors';
import { RequiredString } from '@/application/validation';

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: jest.Mock;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = jest.fn();
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' });
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('Should build Validators correctly', () => {
    const validators = sut.buildValidators({ token });

    expect(validators).toEqual([new RequiredString('any_token', 'token')]);
  });

  it('Should call FacebookAuthentication with correct input', async () => {
    await sut.handle({ token });

    expect(facebookAuth).toHaveBeenCalledWith({ token });
    expect(facebookAuth).toHaveBeenCalledTimes(1);
  });

  it('Should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError());

    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({ statusCode: 401, data: new UnauthorizedError() });
  });

  it('Should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({ statusCode: 200, data: { accessToken: 'any_value' } });
  });
});
