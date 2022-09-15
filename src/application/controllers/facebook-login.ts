import { AuthenticationError } from '@/domain/errors';
import { FacebookAuthentication } from '@/domain/features';

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
    await this.facebookAuthentication.perform({ token: httpRequest.token });
    return {
      statusCode: 401,
      data: new AuthenticationError(),
    };
  }
}
