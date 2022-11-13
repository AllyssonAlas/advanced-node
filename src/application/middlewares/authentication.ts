import { Authorize } from '@/domain/usecases';
import { forbidden, HttpResponse } from '@/application/helpers';
import { RequiredStringValidator } from '@/application/validation';

type HttpRequest = { authorization: string };

export class AuthenticationMiddleware {
  constructor(private readonly authorize: Authorize) {}

  async handle({ authorization }: HttpRequest): Promise<HttpResponse<Error> | undefined> {
    try {
      const error = new RequiredStringValidator(authorization, 'authorization').validate();
      if (error) {
        return forbidden();
      }
      await this.authorize({ token: authorization });
    } catch (error) {
      return forbidden();
    }
  }
}
