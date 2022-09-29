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
    try {
      const accessToken = await this.facebookAuthentication({ token });
      return ok(accessToken);
    } catch (error) {
      return unauthorized();
    }
  }

  override buildValidators({ token }: any): Validator[] {
    return [...Builder.of({ value: token, fieldName: 'token' }).required().build()];
  }
}
