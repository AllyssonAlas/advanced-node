import { mock, MockProxy } from 'jest-mock-extended';

import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveProfilePicture, LoadUserProfile } from '@/domain/contracts/repositories';

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<SaveProfilePicture & LoadUserProfile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    file = Buffer.from('any_buffer');
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    crypto = mock();
    userProfileRepo = mock();
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
  });

  it('Should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('Should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('Should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url',
      initials: undefined,
    });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('Should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({ pictureUrl: undefined });
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('Should call LoadUserProfile with correct input', async () => {
    await sut({ id: 'any_id', file: undefined });

    expect(userProfileRepo.load).toHaveBeenCalledWith({ id: 'any_id' });
    expect(userProfileRepo.load).toHaveBeenCalledTimes(1);
  });

  it('Should not call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file });

    expect(userProfileRepo.load).not.toHaveBeenCalled();
  });
});
