import request from 'supertest';
import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';

import { PgUser } from '@/infra/repos/postgres/entities';
import { app } from '@/main/config/app';
import { env } from '@/main/config/env';

import { makeFakeDb } from '@/tests/infra/repos/postegres/mocks';

describe('User Routes', () => {
  let backup: IBackup;
  let pgUserRepo: Repository<PgUser>;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    pgUserRepo = getRepository(PgUser);
    backup = db.backup();
  });

  beforeEach(() => {
    backup.restore();
  });

  afterAll(async () => {
    await getConnection().close();
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
    it('Should return 403 if no authorization header is present', async () => {
      const { status } = await request(app).put('/api/users/picture');

      expect(status).toBe(403);
    });
  });
});
