import { AccessToken } from '@/domain/entities';
import { FacebookAuthentication } from '@/domain/usecases';
import { Controller } from '@/application/controllers';
import { ValidationBuilder as Builder, Validator } from '@/application/validation';
import { ok, HttpResponse, unauthorized } from '@/application/helpers';

type HttpRequest = { token: string };

type Model = Error | { accessToken: string };

export class FacebookLoginController extends Controller {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {
    super();
  }

  async perform({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication({ token });
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized();
  }

  override buildValidators({ token }: any): Validator[] {
    return [...Builder.of({ value: token, fieldName: 'token' }).required().build()];
  }
}
