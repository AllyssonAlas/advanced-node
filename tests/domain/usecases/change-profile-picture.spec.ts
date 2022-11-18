import { mock } from 'jest-mock-extended';

import { setupChangeProfilePicture, UploadFile } from '@/domain/usecases';

describe('ChangeProfilePicture', () => {
  it('Should call UploadFile with correct input', async () => {
    const file = Buffer.from('any_buffer');
    const fileStorage = mock<UploadFile>();
    const sut = setupChangeProfilePicture(fileStorage);

    await sut({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
