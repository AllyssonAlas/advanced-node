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
  let file: Buffer;
  let putObjectPromiseSpy: jest.Mock;
  let putObjectSpy: jest.Mock;

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, bucket);
  });

  beforeAll(() => {
    accessKey = 'any_access_key';
    secret = 'any_secret';
    bucket = 'any_bucket';
    key = 'any_key';
    file = Buffer.from('any_buffer');
    putObjectPromiseSpy = jest.fn();
    putObjectSpy = jest.fn().mockImplementation(() => ({ promise: putObjectPromiseSpy }));
    mocked(S3).mockImplementation(
      jest.fn().mockImplementation(() => ({ putObject: putObjectSpy })),
    );
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
});
