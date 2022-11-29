import multer from 'multer';

import { mocked } from 'ts-jest/utils';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { getMockReq, getMockRes } from '@jest-mock/express';

import { adaptMulter } from '@/main/adapters';
import { ServerError } from '@/application/errors';

jest.mock('multer');

describe('MulterAdapter', () => {
  let uploadSpy: jest.Mock;
  let singleSpy: jest.Mock;
  let multerSpy: jest.Mock;
  let fakeMulter: jest.Mocked<typeof multer>;
  let req: Request;
  let res: Response;
  let next: NextFunction;
  let sut: RequestHandler;

  beforeAll(() => {
    uploadSpy = jest.fn().mockImplementation(() => {});
    singleSpy = jest.fn().mockImplementation(() => uploadSpy);
    multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }));
    fakeMulter = multer as jest.Mocked<typeof multer>;
    mocked(fakeMulter).mockImplementation(multerSpy);
    req = getMockReq({ body: { anyBody: 'any_body' }, locals: { anyLocals: 'any_locals' } });
    res = getMockRes().res;
    next = getMockRes().next;
  });

  beforeEach(() => {
    sut = adaptMulter;
  });

  it('Should call single upload with correct input', () => {
    sut(req, res, next);

    expect(multerSpy).toHaveBeenCalledWith();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith('picture');
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return 500 if upload fails', () => {
    const error = new Error('multer_error');
    uploadSpy = jest.fn().mockImplementationOnce((req, res, next) => {
      next(error);
    });

    sut(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: new ServerError(error).message });
    expect(res.json).toHaveBeenCalledTimes(1);
  });
});
