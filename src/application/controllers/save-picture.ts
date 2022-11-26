import { ChangeProfilePicture } from '@/domain/usecases';
import { HttpResponse, badRequest } from '@/application/helpers';
import { InvalidMimeTypeError, RequiredFieldError, MaxFileSizeError } from '@/application/errors';

type HttpRequest = { file: { buffer: Buffer; mimeType: string }; userId: string };
type Model = Error;

export class SavePictureController {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle({ file, userId }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (!file || !file?.buffer?.length) return badRequest(new RequiredFieldError('file'));
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimeType)) {
      return badRequest(new InvalidMimeTypeError(['png', 'jpeg']));
    }
    if (file.buffer.length > 5 * 1024 * 1024) return badRequest(new MaxFileSizeError(5));
    await this.changeProfilePicture({ id: userId, file: file.buffer });
  }
}
