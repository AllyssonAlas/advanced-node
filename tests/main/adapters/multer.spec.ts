import multer from 'multer';

import { mocked } from 'ts-jest/utils';
import { getMockReq, getMockRes } from '@jest-mock/express';

import { adaptMulter } from '@/main/adapters';

jest.mock('multer');

describe('MulterAdapter', () => {
  it('Should call single upload with correct input', () => {
    const uploadSpy = jest.fn();
    const singleSpy = jest.fn().mockImplementation(() => uploadSpy);
    const multerSpy = jest.fn().mockImplementation(() => ({ single: singleSpy }));
    const fakeMulter = multer as jest.Mocked<typeof multer>;
    mocked(fakeMulter).mockImplementation(multerSpy);
    const req = getMockReq({ body: { anyBody: 'any_body' }, locals: { anyLocals: 'any_locals' } });
    const res = getMockRes().res;
    const next = getMockRes().next;
    const sut = adaptMulter;

    sut(req, res, next);

    expect(multerSpy).toHaveBeenCalledWith();
    expect(multerSpy).toHaveBeenCalledTimes(1);
    expect(singleSpy).toHaveBeenCalledWith('picture');
    expect(singleSpy).toHaveBeenCalledTimes(1);
    expect(uploadSpy).toHaveBeenCalledWith(req, res, expect.any(Function));
    expect(uploadSpy).toHaveBeenCalledTimes(1);
  });
});
