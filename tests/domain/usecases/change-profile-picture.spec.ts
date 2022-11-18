import { mock } from 'jest-mock-extended';

import { setupChangeProfilePicture, UploadFile, UUIDGenerator } from '@/domain/usecases';

describe('ChangeProfilePicture', () => {
  it('Should call UploadFile with correct input', async () => {
    const uuid = 'any_unique_id';
    const file = Buffer.from('any_buffer');
    const fileStorage = mock<UploadFile>();
    const crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
    const sut = setupChangeProfilePicture(fileStorage, crypto);

    await sut({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
