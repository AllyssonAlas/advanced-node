export interface SaveProfilePicture {
  savePicture: (input: SaveProfilePicture.Input) => Promise<void>;
}

export namespace SaveProfilePicture {
  export type Input = { id: string; pictureUrl?: string | undefined; initials?: string };
}

export interface LoadUserProfile {
  load: (input: LoadUserProfile.Input) => Promise<LoadUserProfile.Output>;
}

export namespace LoadUserProfile {
  export type Input = { id: string };
  export type Output = { name?: string };
}
