import { mocked } from 'ts-jest/utils';
import { mock, MockProxy } from 'jest-mock-extended';

import { UserProfile } from '@/domain/entities';
import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases';
import { DeleteFile, UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';
import { SaveUserPicture, LoadUserProfile } from '@/domain/contracts/repositories';

jest.mock('@/domain/entities/user-profile');

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let fileStorage: MockProxy<UploadFile & DeleteFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    mimeType = 'image/png';
    buffer = Buffer.from('any_buffer');
    file = { buffer, mimeType };
    fileStorage = mock();
    fileStorage.upload.mockResolvedValue('any_url');
    crypto = mock();
    userProfileRepo = mock();
    userProfileRepo.load.mockResolvedValue({ name: 'Allysson Alas Santos' });
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo);
  });

  it('Should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/png' } });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.png` });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('Should call UploadFile with correct input 2', async () => {
    await sut({ id: 'any_id', file: { buffer, mimeType: 'image/jpeg' } });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file: buffer, fileName: `${uuid}.jpeg` });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });

  it('Should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined });

    expect(fileStorage.upload).not.toHaveBeenCalled();
  });

  it('Should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances);
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1);
  });

  it('Should call SaveUserPicture with correct input when LoadUserProfile returns undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce(undefined);
    await sut({ id: 'any_id', file });

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith(...mocked(UserProfile).mock.instances);
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

  it('Should return correct data on succes', async () => {
    mocked(UserProfile).mockImplementationOnce((id) => ({
      setPicture: jest.fn(),
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: 'any_initias',
    }));

    const output = await sut({ id: 'any_id', file });

    expect(output).toMatchObject({
      pictureUrl: 'any_url',
      initials: 'any_initias',
    });
  });

  it('Should call DeleteFile when file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
    expect.assertions(2);

    const promise = sut({ id: 'any_id', file });

    promise.catch(() => {
      expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: uuid });
      expect(fileStorage.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('Should not call DeleteFile when does not file exists and SaveUserPicture throws', async () => {
    userProfileRepo.savePicture.mockRejectedValueOnce(new Error());
    expect.assertions(1);

    const promise = sut({ id: 'any_id', file: undefined });

    promise.catch(() => {
      expect(fileStorage.delete).not.toHaveBeenCalled();
    });
  });

  it('Should rethrow if SaveUserPicture throws', async () => {
    const error = new Error('save_error');
    userProfileRepo.savePicture.mockRejectedValueOnce(error);

    const promise = sut({ id: 'any_id', file: undefined });

    await expect(promise).rejects.toThrow(error);
  });
});
