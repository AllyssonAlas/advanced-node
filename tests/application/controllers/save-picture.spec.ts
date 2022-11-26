import { SavePictureController } from '@/application/controllers';
import { RequiredFieldError, InvalidMimeTypeError, MaxFileSizeError } from '@/application/errors';

describe('SavePictureController', () => {
  let buffer: Buffer;
  let mimeType: string;
  let sut: SavePictureController;

  beforeAll(() => {
    buffer = Buffer.from('any_buffer');
    mimeType = 'image/png';
  });

  beforeEach(() => {
    sut = new SavePictureController();
  });

  it('Shoud return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any });

    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') });
  });

  it('Shoud return 400 if file is null', async () => {
    const httpResponse = await sut.handle({ file: null as any });

    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') });
  });

  it('Shoud return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimeType } });

    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') });
  });

  it('Shoud return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'invalid_type' } });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png, jpeg']),
    });
  });

  it('Shoud not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/png' } });

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png, jpeg']),
    });
  });

  it('Shoud not return 400 if file type is valid 2', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpg' } });

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png, jpeg']),
    });
  });

  it('Shoud not return 400 if file type is valid 3', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimeType: 'image/jpeg' } });

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png, jpeg']),
    });
  });

  it('Shoud return 400 if file size bigger than 5MB', async () => {
    const invalidBuffer = Buffer.from(new ArrayBuffer(6 * 1024 * 1024));
    const httpResponse = await sut.handle({ file: { buffer: invalidBuffer, mimeType } });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new MaxFileSizeError(5),
    });
  });
});
