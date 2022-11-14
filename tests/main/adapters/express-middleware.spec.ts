import { getMockReq, getMockRes } from '@jest-mock/express';
import { mock } from 'jest-mock-extended';

import { Middleware, adaptExpressMiddleware } from '@/main/adapters';

describe('ExpressMiddleware', () => {
  it('Should call handle with empty request', async () => {
    const req = getMockReq();
    const res = getMockRes().res;
    const next = getMockRes().next;
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({});
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });

  it('Should call handle with correct request', async () => {
    const req = getMockReq({ headers: { any: 'any' } });
    const res = getMockRes().res;
    const next = getMockRes().next;
    const middleware = mock<Middleware>();
    const sut = adaptExpressMiddleware(middleware);

    await sut(req, res, next);

    expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' });
    expect(middleware.handle).toHaveBeenCalledTimes(1);
  });
});
