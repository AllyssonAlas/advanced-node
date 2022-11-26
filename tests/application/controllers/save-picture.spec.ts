import { SavePictureController } from '@/application/controllers';
import { RequiredFieldError } from '@/application/errors';

describe('SavePictureController', () => {
  it('Shoud return 400 if file is not provided', async () => {
    const sut = new SavePictureController();

    const httpResponse = await sut.handle({ file: undefined });

    expect(httpResponse).toEqual({ statusCode: 400, data: new RequiredFieldError('file') });
  });
});
