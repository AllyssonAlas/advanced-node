import request from 'supertest';
import { IBackup } from 'pg-mem';
import { getConnection } from 'typeorm';

import { PgUser } from '@/infra/repos/postgres/entities';
import { app } from '@/main/config/app';

import { makeFakeDb } from '@/tests/infra/repos/postegres/mocks';

describe('User Routes', () => {
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
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
  });
});
