import { HttpResponse, badRequest } from '@/application/helpers';
import { InvalidMimeTypeError, RequiredFieldError, MaxFileSizeError } from '@/application/errors';

type HttpRequest = { file: { buffer: Buffer; mimeType: string } };
type Model = Error;

export class SavePictureController {
  async handle({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (!file || !file?.buffer?.length) return badRequest(new RequiredFieldError('file'));
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['png', 'jpeg']));
    }
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5));
  }
}
