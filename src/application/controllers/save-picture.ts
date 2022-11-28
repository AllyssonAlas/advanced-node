import { ChangeProfilePicture } from '@/domain/usecases';
import { Controller } from '@/application/controllers';
import { Validator, ValidationBuilder as Builder } from '@/application/validation';
import { HttpResponse, ok } from '@/application/helpers';

type HttpRequest = { file: { buffer: Buffer; mimeType: string }; userId: string };
type Model = Error | { initials?: string; pictureUrl?: string };

export class SavePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ file, userId }: HttpRequest): Promise<HttpResponse<Model>> {
    const data = await this.changeProfilePicture({ id: userId, file });
    return ok(data);
  }

  override buildValidators({ file }: HttpRequest): Validator[] {
    return Builder.of({ value: file, fieldName: 'file' })
      .required()
      .image({ allowed: ['png', 'jpg'], maxSizeInMb: 5 })
      .build();
  }
}
