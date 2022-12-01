import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases';
import { makeAwsS3FileStorage, makeUniqueID } from '@/main/factories/infra/gateways';
import { makePgUserProfileRepo } from '@/main/factories/infra/repos';

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(makeAwsS3FileStorage(), makeUniqueID(), makePgUserProfileRepo());
};
