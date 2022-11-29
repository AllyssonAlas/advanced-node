import { SavePictureController, Controller } from '@/application/controllers';
import { AllowedMimeTypes, MaxFileSize, Required, RequiredBuffer } from '@/application/validation';

describe('SavePictureController', () => {
  let buffer: Buffer;
  let mimeType: string;
  let file: { buffer: Buffer; mimeType: string };
  let userId: string;
  let sut: SavePictureController;
  let changeProfilePicture: jest.Mock;

  beforeAll(() => {
    buffer = Buffer.from('any_buffer');
    mimeType = 'image/png';
    file = { buffer, mimeType };
    userId = 'any_user_id';
    changeProfilePicture = jest
      .fn()
      .mockResolvedValue({ initials: 'any_initials', pictureUrl: 'any_url' });
  });

  beforeEach(() => {
    sut = new SavePictureController(changeProfilePicture);
  });

  it('Should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('Should build Validators correctly on save', () => {
    const validators = sut.buildValidators({ file, userId });

    expect(validators).toEqual([
      new Required(file, 'file'),
      new RequiredBuffer(buffer, 'file'),
      new AllowedMimeTypes(['png', 'jpg'], mimeType),
      new MaxFileSize(5, buffer),
    ]);
  });

  it('Should build Validators correctly on delete', () => {
    const validators = sut.buildValidators({ file: undefined, userId });

    expect(validators).toEqual([]);
  });

  it('Shoud call ChangeProfilePicture with correct input', async () => {
    await sut.perform({ file, userId });

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: userId, file });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('Shoud return 200 with valid data', async () => {
    const httpResponse = await sut.perform({ file, userId });

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { initials: 'any_initials', pictureUrl: 'any_url' },
    });
  });
});
