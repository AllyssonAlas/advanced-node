import { ChangeProfilePicture } from '@/domain/usecases';
import { HttpResponse, noContent } from '@/application/helpers';
import { Controller } from './controller';

type HttpRequest = { userId: string };

export class DeletePictureController extends Controller {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {
    super();
  }

  async perform({ userId }: HttpRequest): Promise<HttpResponse> {
    await this.changeProfilePicture({ id: userId });
    return noContent();
  }
}
