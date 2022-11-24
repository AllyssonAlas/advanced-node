import { getRepository } from 'typeorm';

import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repos/postgres/entities';

// eslint-disable-next-line prettier/prettier
export class PgUserAccountRepository implements LoadUserAccount, SaveFacebookAccount
{
  async load(input: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne(input);
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook({
    id,
    name,
    email,
    facebookId,
  }: SaveFacebookAccount.Input): Promise<SaveFacebookAccount.Output> {
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
