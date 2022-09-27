import { getRepository } from 'typeorm';

import {
  LoadUserAccountRepository,
  SaveFacebookAccountRepository,
} from '@/domain/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';

type LoadParams = LoadUserAccountRepository.Params;
type LoadResult = LoadUserAccountRepository.Result;
type SavaParams = SaveFacebookAccountRepository.Params;
type SavaResult = SaveFacebookAccountRepository.Result;

// eslint-disable-next-line prettier/prettier
export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository
{
  async load(params: LoadParams): Promise<LoadResult> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne(params);
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(params: SavaParams): Promise<SavaResult> {
    const pgUserRepo = getRepository(PgUser);
    let id: string;
    if (!params.id) {
      const pgUser = await pgUserRepo.save({
        name: params.name,
        email: params.email,
        facebookId: params.facebookId,
      });
      id = pgUser.id.toString();
    } else {
      id = params.id;
      await pgUserRepo.update(
        { id: parseInt(id) },
        { name: params.name, facebookId: params.facebookId },
      );
    }
    return { id };
  }
}
