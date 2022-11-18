export namespace UploadFile {
  export type Params = {
    key: string;
    file: Buffer;
  };
}

export interface UploadFile {
  upload: (input: UploadFile.Params) => Promise<void>;
}

type Input = { id: string; file: Buffer };
type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (fileStorage: UploadFile) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage) => {
  return async ({ id, file }) => {
    await fileStorage.upload({ file, key: id });
  };
};
