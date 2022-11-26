import { HttpResponse, badRequest } from '@/application/helpers';
import { RequiredFieldError } from '@/application/errors';

type HttpRequest = { file: { buffer: Buffer } };
type Model = Error;

export class SavePictureController {
  async handle({ file }: HttpRequest): Promise<HttpResponse<Model>> {
    return badRequest(new RequiredFieldError('file'));
  }
}
