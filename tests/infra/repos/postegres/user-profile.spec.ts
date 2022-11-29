import { IBackup } from 'pg-mem';
import { getConnection, getRepository, Repository } from 'typeorm';

import { PgUserProfileRepository } from '@/infra/repos/postgres';
import { PgUser } from '@/infra/repos/postgres/entities';

import { makeFakeDb } from '@/tests/infra/repos/postegres/mocks';

describe('PgUserProfileRepository', () => {
  let sut: PgUserProfileRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;

  beforeAll(async () => {
    const db = await makeFakeDb([PgUser]);
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserProfileRepository();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('savePicture', () => {
    it('Should update user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', initials: 'any_initials' });

      await sut.savePicture({ id: id.toString(), pictureUrl: 'any_url' });
      const pgUser = await pgUserRepo.findOne({ id });

      expect(pgUser).toMatchObject({ id, pictureUrl: 'any_url', initials: null });
    });
  });

  describe('load', () => {
    it('Should load user profile', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email', name: 'any_name' });

      const userProfile = await sut.load({ id: id.toString() });

      expect(userProfile?.name).toBe('any_name');
    });

    it('Should load user profile with an undefined name', async () => {
      const { id } = await pgUserRepo.save({ email: 'any_email' });

      const userProfile = await sut.load({ id: id.toString() });

      expect(userProfile?.name).toBeUndefined();
    });

    it('Should return undefined', async () => {
      const userProfile = await sut.load({ id: '1' });

      expect(userProfile).toBeUndefined();
    });
  });
});
