import { config } from 'aws-sdk';

import { AwsS3FileStorage } from '@/infra/gateways';

jest.mock('aws-sdk');

describe('AwsS3FileStorage', () => {
  let sut: AwsS3FileStorage;
  let accessKey: string;
  let secret: string;

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret);
  });

  beforeAll(() => {
    accessKey = 'any_access_key';
    secret = 'any_secret';
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
});
