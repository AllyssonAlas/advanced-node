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
});
