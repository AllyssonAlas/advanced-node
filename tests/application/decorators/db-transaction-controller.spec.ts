import { mock, MockProxy } from 'jest-mock-extended';

import { DbTransactionController } from '@/application/decorators';
import { DbTransaction } from '@/application/contracts';

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
  });

  beforeEach(() => {
    sut = new DbTransactionController(db);
  });

  it('Should open transaction', async () => {
    await sut.perform({ any: 'any' });

    expect(db.openTransaction).toHaveBeenCalledWith();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });
});
