import { UserProfile } from '@/domain/entities';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repositories';

type Input = { id: string; file?: Buffer };
type Output = { pictureUrl?: string; name?: string };
export type ChangeProfilePicture = (input: Input) => Promise<Output>;
type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ id, file }) => {
    const data: { pictureUrl?: string; name?: string } = {};
    if (file) {
      data.pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) });
    } else {
      data.name = (await userProfileRepo.load({ id })).name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    await userProfileRepo.savePicture(userProfile);
    return userProfile;
  };
};
