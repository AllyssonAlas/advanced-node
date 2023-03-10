import { UserProfile } from '@/domain/entities';
import { UploadFile, DeleteFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repositories';

type Input = { id: string; file?: { buffer: Buffer; mimeType: string } };
type Output = { pictureUrl?: string; initials?: string };
export type ChangeProfilePicture = (input: Input) => Promise<Output>;
type Setup = (
  fileStorage: UploadFile & DeleteFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveUserPicture & LoadUserProfile,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ id, file }) => {
    const key = crypto.uuid({ key: id });
    const data: { pictureUrl?: string; name?: string } = {};
    if (file) {
      data.pictureUrl = await fileStorage.upload({
        file: file.buffer,
        fileName: `${key}.${file.mimeType.split('/')[1]}`,
      });
    } else {
      data.name = (await userProfileRepo.load({ id }))?.name;
    }
    const userProfile = new UserProfile(id);
    userProfile.setPicture(data);
    try {
      await userProfileRepo.savePicture(userProfile);
    } catch (error) {
      if (file) {
        await fileStorage.delete({ fileName: key });
      }
      throw error;
    }
    return userProfile;
  };
};
