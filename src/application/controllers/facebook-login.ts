import { AccessToken } from '@/domain/models';
import { FacebookAuthentication } from '@/domain/features';
import { ok, badRequest, HttpResponse, serverError, unauthorized } from '@/application/helpers';
import { RequiredFieldError } from '@/application/errors';

type HttpRequest = {
  token: string;
};

type Model =
  | Error
  | {
      accessToken: string;
    };

export class FacebookLoginController {
  constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validate(httpRequest);
      if (error) {
        return badRequest(error);
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

  private validate(httpRequest: HttpRequest): Error | undefined {
    if (!httpRequest.token) {
      return new RequiredFieldError('token');
    }
  }
}
