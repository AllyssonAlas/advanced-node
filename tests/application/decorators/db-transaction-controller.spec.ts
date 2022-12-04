import { mock, MockProxy } from 'jest-mock-extended';

import { Controller } from '@/application/controllers';
import { DbTransactionController } from '@/application/decorators';
import { DbTransaction } from '@/application/contracts';

describe('DbTransactionController', () => {
  let db: MockProxy<DbTransaction>;
  let decoratee: MockProxy<Controller>;
  let sut: DbTransactionController;

  beforeAll(() => {
    db = mock();
    decoratee = mock();
  });

  beforeEach(() => {
    sut = new DbTransactionController(decoratee, db);
  });

  it('Should open transaction', async () => {
    await sut.perform({ any: 'any' });

    expect(db.openTransaction).toHaveBeenCalledWith();
    expect(db.openTransaction).toHaveBeenCalledTimes(1);
  });

  it('Should execute decoratee', async () => {
    await sut.perform({ any: 'any' });

    expect(decoratee.perform).toHaveBeenCalledWith({ any: 'any' });
    expect(decoratee.perform).toHaveBeenCalledTimes(1);
  });
});
