import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/repos/postgres/entities';
import { PgRepository } from '@/infra/repos/postgres';

export class PgUserAccountRepository
  extends PgRepository
  implements LoadUserAccount, SaveFacebookAccount
{
  async load(input: LoadUserAccount.Input): Promise<LoadUserAccount.Output> {
    const pgUserRepo = this.getRepository(PgUser);
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
    const pgUserRepo = this.getRepository(PgUser);
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
