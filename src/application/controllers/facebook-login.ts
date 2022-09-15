import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';

type HttpResponse = {
  statusCode: number;
  data: any;
};

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
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
  }
}
