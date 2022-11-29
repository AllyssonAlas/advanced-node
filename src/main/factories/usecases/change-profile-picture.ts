import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases';
import { makeAwsS3FileStorage, makeUniqueID } from '@/main/factories/gateways';
import { makePgUserProfileRepo } from '@/main/factories/repos';

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(makeAwsS3FileStorage(), makeUniqueID(), makePgUserProfileRepo());
};
