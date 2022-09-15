import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';

type HttpResponse = {
  statusCode: number;
  data: any;
};

export class ServerError extends Error {
  constructor(error?: Error) {
    super('Server failed. Try again later');
    this.name = 'ServerError';
    this.stack = error?.stack;
  }
}

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return {
          statusCode: 400,
          data: new Error('The field token is required'),
        };
      }
      const result = await this.facebookAuthentication.perform({ token: httpRequest.token });
      if (result instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: result.value,
          },
        };
      } else {
        return {
          statusCode: 401,
          data: new AuthenticationError(),
        };
      }
    } catch (error) {
      const err = error as Error;
      return {
        statusCode: 500,
        data: new ServerError(err),
      };
    }
  }
}
