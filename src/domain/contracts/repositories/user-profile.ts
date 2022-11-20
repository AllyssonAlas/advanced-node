export interface SaveProfilePicture {
  savePicture: (params: SaveProfilePicture.Params) => Promise<void>;
}

export namespace SaveProfilePicture {
  export type Params = {
    pictureUrl: string | undefined;
  };
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<void>;
}

export namespace LoadUserProfile {
  export type Params = {
    id: string;
  };
}
