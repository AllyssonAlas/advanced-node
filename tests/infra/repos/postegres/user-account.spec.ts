import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';

import { PgUserAccountRepository } from '@/infra/repos/postgres';
import { PgUser } from '@/infra/repos/postgres/entities';

import { makeFakeDb } from '@/tests/infra/repos/postegres/mocks';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('load', () => {
    it('Should return an account if email exists', async () => {
      await pgUserRepo.save({ email: 'existing_email' });

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
    });

    it('Should return undefined if email does not exist', async () => {
      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('Should create an account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_facebook_id',
      });
      const pgUser = await pgUserRepo.findOne({ email: 'any_email' });

      expect(pgUser?.id).toBe(1);
      expect(id).toBe('1');
    });

    it('Should update an account if id is defined', async () => {
      await pgUserRepo.save({
        email: 'any_email',
        name: 'any_name',
        facebookId: 'any_facebook_id',
      });

      const { id } = await sut.saveWithFacebook({
        id: '1',
        email: 'new_email',
        name: 'new_name',
        facebookId: 'new_facebook_id',
      });

      const pgUser = await pgUserRepo.findOne(1);

      expect(pgUser).toEqual({
        id: 1,
        email: 'any_email',
        name: 'new_name',
        facebookId: 'new_facebook_id',
      });
      expect(id).toBe('1');
    });
  });
});
