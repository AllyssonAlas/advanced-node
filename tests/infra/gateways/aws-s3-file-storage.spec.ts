import { config, S3 } from 'aws-sdk';
import { mocked } from 'ts-jest/utils';

import { AwsS3FileStorage } from '@/infra/gateways';

jest.mock('aws-sdk');

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage;
  let accessKey: string;
  let secret: string;
  let bucket: string;
  let key: string;

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket);
  });

  beforeAll(() => {
    accessKey = 'any_access_key';
    secret = 'any_secret';
    bucket = 'any_bucket';
    key = 'any_key';
  });

  it('Should config aws credentials on creation', () => {
    expect(sut).toBeDefined();
    expect(config.update).toHaveBeenCalledWith({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret,
      },
    });
    expect(config.update).toHaveBeenCalledTimes(1);
  });

  describe('upload', () => {
    let file: Buffer;
    let putObjectPromiseSpy: jest.Mock;
    let putObjectSpy: jest.Mock;

    beforeAll(() => {
      file = Buffer.from('any_buffer');
      putObjectPromiseSpy = jest.fn();
      putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }));
      mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })),
      );
    });

    it('Should call putObject with correct input', async () => {
      await sut.upload({ file, key });

      expect(putObjectSpy).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key,
        Body: file,
        ACL: 'public-read',
      });
      expect(putObjectSpy).toHaveBeenCalledTimes(1);
      expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('Should return imageUrl', async () => {
      const imageUrl = await sut.upload({ file, key });

      expect(imageUrl).toBe(`http://${bucket}.s3.amazonaws.com/${key}`);
    });

    it('Should return encoded imageUrl', async () => {
      const imageUrl = await sut.upload({ file, key: 'any key' });

      expect(imageUrl).toBe(`http://${bucket}.s3.amazonaws.com/any%20key`);
    });

    it('Should rethrow if putObject throws', async () => {
      const error = new Error('upload_error');

      putObjectPromiseSpy.mockRejectedValueOnce(error);

      const promise = sut.upload({ file, key });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('delete', () => {
    let deleteObjectPromiseSpy: jest.Mock;
    let deleteObjectSpy: jest.Mock;

    beforeAll(() => {
      deleteObjectPromiseSpy = jest.fn();
      deleteObjectSpy = jest.fn().mockImplementation(() => ({ promise: deleteObjectPromiseSpy }));
      mocked(S3).mockImplementation(
        jest.fn().mockImplementation(() => ({ deleteObject: deleteObjectSpy })),
      );
    });

    it('Should call deleteObject with correct input', async () => {
      await sut.delete({ key });

      expect(deleteObjectSpy).toHaveBeenCalledWith({ Bucket: bucket, Key: key });
      expect(deleteObjectSpy).toHaveBeenCalledTimes(1);
      expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1);
    });

    it('Should rethrow if deleteObject throws', async () => {
      const error = new Error('delete_error');

      deleteObjectPromiseSpy.mockRejectedValueOnce(error);

      const promise = sut.delete({ key });

      await expect(promise).rejects.toThrow(error);
    });
  });
});
