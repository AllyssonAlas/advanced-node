export namespace UploadFile {
  export type Input = {
    key: string;
    file: Buffer;
  };
}

export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<void>;
}
