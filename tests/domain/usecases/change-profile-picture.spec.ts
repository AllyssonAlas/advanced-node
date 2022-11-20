import { mock, MockProxy } from 'jest-mock-extended';

import { setupChangeProfilePicture, ChangeProfilePicture } from '@/domain/usecases';
import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways';

describe('ChangeProfilePicture', () => {
  let uuid: string;
  let file: Buffer;
  let fileStorage: MockProxy<UploadFile>;
  let crypto: MockProxy<UUIDGenerator>;
  let sut: ChangeProfilePicture;

  beforeAll(() => {
    uuid = 'any_unique_id';
    file = Buffer.from('any_buffer');
    fileStorage = mock<UploadFile>();
    crypto = mock<UUIDGenerator>();
    crypto.uuid.mockReturnValue(uuid);
  });

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto);
  });

  it('Should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file });

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_unique_id' });
    expect(fileStorage.upload).toHaveBeenCalledTimes(1);
  });
});
