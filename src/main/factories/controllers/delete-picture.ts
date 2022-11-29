import { DeletePictureController } from '@/application/controllers';
import { makeChangeProfilePicture } from '@/main/factories/usecases';

export const makeDeletePcitureController = (): DeletePictureController => {
  return new DeletePictureController(makeChangeProfilePicture());
};
