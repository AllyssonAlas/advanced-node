import { getRepository } from 'typeorm';

import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccount.Input;
type LoadResult = LoadUserAccount.Output;
type SavaParams = SaveFacebookAccount.Input;
type SavaResult = SaveFacebookAccount.Output;

// eslint-disable-next-line prettier/prettier
export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount
{
  async load(input: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne(input);
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook({ id, name, email, facebookId }: SavaParams): Promise<SavaResult> {
    const pgUserRepo = getRepository(PgUser);
    let resultId: string;
    if (!id) {
      const pgUser = await pgUserRepo.save({ name, email, facebookId });
      resultId = pgUser.id.toString();
    } else {
      resultId = id;
      await pgUserRepo.update({ id: parseInt(id) }, { name, facebookId });
    }
    return { id: resultId };
  }
}
