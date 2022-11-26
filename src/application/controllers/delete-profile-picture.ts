import { ChangeProfilePicture } from '@/domain/usecases';

type HttpRequest = { userId: string };

export class DeletePictureController {
  constructor(private readonly changeProfilePicture: ChangeProfilePicture) {}

  async handle({ userId }: HttpRequest): Promise<void> {
    await this.changeProfilePicture({ id: userId });
  }
}
