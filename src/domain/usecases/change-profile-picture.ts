import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';

type Input = { id: string; file: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
  return async ({ id, file }) => {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) });
  };
};
