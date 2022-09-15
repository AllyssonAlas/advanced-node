import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { badRequest, HttpResponse } from '@/application/helpers';
import { RequiredFieldError, ServerError } from '@/application/errors';

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError('token'));
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
