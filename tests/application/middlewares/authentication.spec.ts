import { AuthenticationMiddleware } from '@/application/middlewares';
import { ForbiddenError } from '@/application//errors';

describe('AuthenticationMiddleware', () => {
  let sut: AuthenticationMiddleware;
  let authorize: jest.Mock;
  let authorization: string;

  beforeAll(() => {
    authorization = 'any_authorization_token';
    authorize = jest.fn();
  });

  beforeEach(() => {
    sut = new AuthenticationMiddleware(authorize);
  });

  it('Should return 403 if authorization is empty', async () => {
    const httpResponse = await sut.handle({ authorization: '' });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('Should return 403 if authorization is null', async () => {
    const httpResponse = await sut.handle({ authorization: null as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('Should return 403 if authorization is undefined', async () => {
    const httpResponse = await sut.handle({ authorization: undefined as any });

    expect(httpResponse).toEqual({
      statusCode: 403,
      data: new ForbiddenError(),
    });
  });

  it('Should call authorize with correct input', async () => {
    await sut.handle({ authorization });

    expect(authorize).toHaveBeenCalledWith({ token: authorization });
    expect(authorize).toHaveBeenCalledTimes(1);
  });
});
