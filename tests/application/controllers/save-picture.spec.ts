import { SavePictureController } from '@/application/controllers';
import { RequiredFieldError } from '@/application/errors';

describe('SavePictureController', () => {
  let sut: SavePictureController;

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
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from('') } });

    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') });
  });
});
