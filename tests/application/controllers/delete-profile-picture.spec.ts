import { DeletePictureController } from '@/application/controllers';

describe('DeletePictureController', () => {
  it('Should call ChangeProfilePicture with correct input', async () => {
    const changeProfilePicture = jest.fn();
    const sut = new DeletePictureController(changeProfilePicture);

    await sut.handle({ userId: 'any_user_id' });

    expect(changeProfilePicture).toHaveBeenCalledWith({ id: 'any_user_id' });
    expect(changeProfilePicture).toHaveBeenCalledTimes(1);
  });
});
