import request from 'supertest';
import { IBackup } from 'pg-mem';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { PgConnection } from '@/infra/repos/postgres/helpers';
import { PgUser } from '@/infra/repos/postgres/entities';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';

import { makeFakeDb } from '@/tests/infra/repos/postegres/mocks';

describe('User Routes', () => {
  let connection: PgConnection;
  let backup: IBackup;
  let pgUserRepo: Repository<PgUser>;

  beforeAll(async () => {
    connection = PgConnection.getInstance();
    const db = await makeFakeDb([PgUser]);
    pgUserRepo = connection.getRepository(PgUser);
    backup = db.backup();
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await connection.disconnect();
  });

  describe('DELETE /users/picture', () => {
    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app).delete('/api/users/picture');

      expect(status).toBe(403);
    });

    it('Should return 200 on success with valid data', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Allysson Alas' });
      const authorization = sign({ key: id }, env.jwtSecret);

      const { status, body } = await request(app)
        .delete('/api/users/picture')
        .set({ authorization });

      expect(status).toBe(200);
      expect(body).toEqual({ pictureUrl: undefined, initials: 'AA' });
    });
  });

  describe('PUT /users/picture', () => {
    const uploadSpy = jest.fn();

    jest.mock('@/infra/gateways/aws-s3-file-storage', () => ({
      AwsS3FileStorage: jest.fn().mockReturnValue({
        upload: uploadSpy,
      }),
    }));

    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app).put('/api/users/picture');

      expect(status).toBe(403);
    });

    it('Should return 200 on success with valid data', async () => {
      uploadSpy.mockResolvedValueOnce('any_url');
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'Allysson Alas' });
      const authorization = sign({ key: id }, env.jwtSecret);

      const { status, body } = await request(app)
        .put('/api/users/picture')
        .set({ authorization })
        .attach('picture', Buffer.from('any_buffer'), {
          filename: 'any_name',
          contentType: 'image/png',
        });

      expect(status).toBe(200);
      expect(body).toEqual({ pictureUrl: 'any_url', initials: undefined });
    });
  });
});
