import { mock } from 'jest-mock-extended';

import { DbTransactionController } from '@/application/decorators';
import { DbTransaction } from '@/application/contracts';

describe('DbTransactionController', () => {
  it('Should open transaction', async () => {
    const db = mock<DbTransaction>();
    const sut = new DbTransactionController(db);

    await sut.perform({ any: 'any' });

    expect(db.openTransaction).toHaveBeenCalledWith();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });
});
