import { DeletePictureController } from '@/application/controllers';

describe('DeletePictureController', () => {
  let sut: DeletePictureController;
  let changeProfilePicture: jest.Mock;

  beforeAll(() => {
    changeProfilePicture = jest.fn();
  });

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture);
  });

  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.handle({ userId: 'any_user_id' });

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('Should return 204', async () => {
    const httpResponse = await sut.handle({ userId: 'any_user_id' });

    expect(httpResponse).toEqual({ statusCode: 204, data: null });
  });
});
