import { FacebookAuthentication } from '@/domain/features';

type HttpResponse = {
  statusCode: number;
  data: any;
};

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    await this.facebookAuthentication.perform({ token: httpRequest.token });

    return {
      statusCode: 400,
      data: new Error('the field token is required'),
    };
  }
}
