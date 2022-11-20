export interface SaveProfilePicture {
  savePicture: (params: SaveProfilePicture.Params) => Promise<void>;
}

export namespace SaveProfilePicture {
  export type Params = {
    pictureUrl: string | undefined;
  };
}
