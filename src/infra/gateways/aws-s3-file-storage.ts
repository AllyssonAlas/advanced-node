import { config, S3 } from 'aws-sdk';

import { UploadFile } from '@/domain/contracts/gateways';

export class AwsS3FileStorage {
  constructor(accessKey: string, secret: string, private readonly bucket: string) {
    config.update({
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret,
      },
    });
  }

  async upload({ key, file }: UploadFile.Input): Promise<void> {
    const s3 = new S3();
    await s3.putObject({ Bucket: this.bucket, Key: key, Body: file, ACL: 'public-read' }).promise();
  }
}
