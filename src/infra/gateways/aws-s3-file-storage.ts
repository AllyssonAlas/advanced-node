import { config } from 'aws-sdk';

export class AwsS3FileStorage {
  constructor(private readonly accessKey: string, private readonly secret: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret,
      },
    });
  }
}
