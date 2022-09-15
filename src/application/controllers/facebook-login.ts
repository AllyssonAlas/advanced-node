import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { ok, badRequest, HttpResponse, serverError, unauthorized } from '@/application/helpers';
import { RequiredFieldError } from '@/application/errors';

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: any): Promise<HttpResponse> {
    try {
      if (!httpRequest.token) {
        return badRequest(new RequiredFieldError('token'));
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token });
      if (accessToken instanceof AccessToken) {
        return ok({ accessToken: accessToken.value });
      } else {
        return unauthorized();
      }
    } catch (error) {
      const err = error as Error;
      return serverError(err);
    }
  }
}
