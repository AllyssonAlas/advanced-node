import { mock, MockProxy } from 'jest-mock-extended';
import { mocked } from 'ts-jest/utils';

import { AccessToken } from '@/domain/models';
import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';
import { FacebookLoginController } from '@/application/controllers';
import { ServerError, UnauthorizedError } from '@/application/errors';
import { RequiredStringValidator, ValidationComposite } from '@/application/validation';

jest.mock('@/application/validation/validation-composite');

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController;
  let facebookAuth: MockProxy<FacebookAuthentication>;
  let token: string;

  beforeAll(() => {
    token = 'any_token';
    facebookAuth = mock();
    facebookAuth.perform.mockResolvedValue(new AccessToken('any_value'));
  });

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth);
  });

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const validationCompositeSpy = jest
      .fn()
      .mockImplementationOnce(() => ({ validate: jest.fn().mockReturnValue(error) }));
    mocked(ValidationComposite).mockImplementationOnce(validationCompositeSpy);

    const httpResponse = await sut.handle({ token });

    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredStringValidator('any_token', 'token'),
    ]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('Should call FacebookAuthentication with correct params', async () => {
    await sut.handle({ token });

    expect(facebookAuth.perform).toHaveBeenCalledWith({ token });
    expect(facebookAuth.perform).toHaveBeenCalledTimes(1);
  });

  it('Should return 401 if FacebookAuthentication fails', async () => {
    facebookAuth.perform.mockResolvedValueOnce(new AuthenticationError());
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError(),
    });
  });

  it('Should return 200 if FacebookAuthentication succeeds', async () => {
    const httpResponse = await sut.handle({ token });

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
    const httpResponse = await sut.handle({ token });

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });
});
