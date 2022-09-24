import { getMockReq, getMockRes } from '@jest-mock/express';

import { ExpressRouter } from '@/infra/http';
import { Controller } from '@/application/controllers';
import { mock } from 'jest-mock-extended';

describe('ExpressRouter', () => {
  it('Should call handle with correct rquest', async () => {
    const req = getMockReq({ body: { any: 'any' } });
    const { res } = getMockRes();
    const controller = mock<Controller>();
    const sut = new ExpressRouter(controller);

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({ any: 'any' });
  });

  it('Should call handle with empty rquest', async () => {
    const req = getMockReq();
    const { res } = getMockRes();
    const controller = mock<Controller>();
    const sut = new ExpressRouter(controller);

    await sut.adapt(req, res);

    expect(controller.handle).toHaveBeenCalledWith({});
  });
});
