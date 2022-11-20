import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveProfilePicture } from '@/domain/contracts/repositories';

type Input = { id: string; file?: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (
  fileStorage: UploadFile,
  crypto: UUIDGenerator,
  userProfileRepo: SaveProfilePicture,
) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => {
  return async ({ id, file }) => {
    let pictureUrl: string | undefined;
    if (file) {
      pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) });
    }
    await userProfileRepo.savePicture({ pictureUrl });
  };
};
