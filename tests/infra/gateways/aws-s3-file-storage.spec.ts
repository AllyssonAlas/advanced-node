import { config } from 'aws-sdk';

import { AwsS3FileStorage } from '@/infra/gateways';

jest.mock('aws-sdk');

describe('AwsS3FileStorage', () => {
  it('Should config aws credentials on creation', () => {
    const accessKey = 'any_access_key';
    const secret = 'any_secret';

    const sut = new AwsS3FileStorage(accessKey, secret);

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
