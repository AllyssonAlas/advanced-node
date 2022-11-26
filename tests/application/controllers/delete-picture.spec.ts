import { Controller, DeletePictureController } from '@/application/controllers';

describe('DeletePictureController', () => {
  let sut: DeletePictureController;
  let changeProfilePicture: jest.Mock;

  beforeAll(() => {
    changeProfilePicture = jest.fn();
  });

  beforeEach(() => {
    sut = new DeletePictureController(changeProfilePicture);
  });

  it('Should extend controller', () => {
    expect(sut).toBeInstanceOf(Controller);
  });

  it('Should call ChangeProfilePicture with correct input', async () => {
    await sut.perform({ userId: 'any_user_id' });

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });

  it('Should return 204', async () => {
    const httpResponse = await sut.perform({ userId: 'any_user_id' });

    expect(httpResponse).toEqual({ statusCode: 204, data: null });
  });
});
