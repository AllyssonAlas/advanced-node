import { PgUserAccountRepository } from '@/infra/postgres/repositories';

export const makePgUserAccountRepo = (): PgUserAccountRepository => {
  return new PgUserAccountRepository();
};
