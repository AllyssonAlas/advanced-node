import { FacebookLoginController } from '@/application/controllers';

describe('FacebookLoginController', () => {
  it('Should return 400 if token is empty', async () => {
    const sut = new FacebookLoginController();

    const httpResponse = await sut.handle({ token: '' });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });

  it('Should return 400 if token is null', async () => {
    const sut = new FacebookLoginController();

    const httpResponse = await sut.handle({ token: null });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });

  it('Should return 400 if token is undefined', async () => {
    const sut = new FacebookLoginController();

    const httpResponse = await sut.handle({ token: undefined });

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('the field token is required'),
    });
  });
});
