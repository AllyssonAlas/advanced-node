import { SavePictureController } from '@/application/controllers';
import { RequiredFieldError, InvalidMimeTypeError } from '@/application/errors';

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
});
