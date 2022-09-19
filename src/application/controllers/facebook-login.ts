import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { Controller } from '@/application/controllers';
import { ValidationBuilder as Builder, Validator } from '@/application/validation';
import { ok, HttpResponse, unauthorized } from '@/application/helpers';

type HttpRequest = {
  token: string;
};

type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators(httpRequest: any): Validator[] {
    return [...Builder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()];
  }
}
