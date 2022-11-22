import { mocked } from 'ts-jest/utils';

import { Controller } from '@/application/controllers';
import { ValidationComposite } from '@/application/validation';
import { ServerError } from '@/application/errors';
import { HttpResponse } from '@/application/helpers';

jest.mock('@/application/validation/validation-composite');

class ControllerStub extends Controller {
  output: HttpResponse = {
    statusCode: 200,
    data: 'any_data',
  };

  async perform(httpRequest: any): Promise<HttpResponse> {
    return this.output;
  }
}

describe('Controller', () => {
  let sut: ControllerStub;

  beforeEach(() => {
    sut = new ControllerStub();
  });

  it('Should return 400 if validation fails', async () => {
    const error = new Error('validation_error');
    const validationCompositeSpy = jest
      .fn()
      .mockImplementationOnce(() => ({ validate: jest.fn().mockReturnValue(error) }));
    mocked(ValidationComposite).mockImplementationOnce(validationCompositeSpy);

    const httpResponse = await sut.handle('any_value');

    expect(ValidationComposite).toHaveBeenCalledWith([]);
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error,
    });
  });

  it('Should return 500 if perform throws', async () => {
    const error = new Error('perform_error');
    jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);
    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error),
    });
  });

  it('Should return same output as perform', async () => {
    const httpResponse = await sut.handle('any_value');

    expect(httpResponse).toEqual(sut.output);
  });
});
