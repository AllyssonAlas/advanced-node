export namespace UploadFile {
  export type Input = { key: string; file: Buffer };
  export type Output = string;
}

export interface UploadFile {
  upload: (input: UploadFile.Input) => Promise<UploadFile.Output>;
}
