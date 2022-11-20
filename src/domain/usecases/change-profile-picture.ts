export namespace UploadFile {
  export type Input = {
    key: string;
    file: Buffer;
  };
}

export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>;
}

export namespace UUIDGenerator {
  export type Input = {
    key: string;
  };

  export type Output = string;
}

export interface UUIDGenerator {
  uuid: (input: UUIDGenerator.Input) => UUIDGenerator.Output;
}

type Input = { id: string; file: Buffer };
export type ChangeProfilePicture = (input: Input) => Promise<void>;
type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator) => ChangeProfilePicture;

export const setupChangeProfilePicture: Setup = (fileStorage, crypto) => {
  return async ({ id, file }) => {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) });
  };
};
