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
});
