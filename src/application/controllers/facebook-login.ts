import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { HttpResponse } from '@/application/helpers';
import { ServerError } from '@/application/errors';

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