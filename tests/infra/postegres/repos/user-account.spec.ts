import { newDb } from 'pg-mem';
import { Column, Entity, getRepository, PrimaryGeneratedColumn } from 'typeorm';

import { LoadUserAccountRepository } from '@/data/contracts/repositories';

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load(params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ email: params.email });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }
}

@Entity({ name: 'usuarios' })
class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebook?: string;
}

describe('PgUserAccountRepository', () => {
  describe('load', () => {
    it('Should return an account if email exists', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });

      await connection.synchronize();
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.save({ email: 'existing_email' });
      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
      await connection.close();
    });

    it('Should return undefined if email does not exist', async () => {
      const db = newDb();
      const connection = await db.adapters.createTypeormConnection({
        type: 'postgres',
        entities: [PgUser],
      });

      await connection.synchronize();
      const sut = new PgUserAccountRepository();

      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
      await connection.close();
    });
  });
});
