import { Controller } from '@/application/controllers';
import { DbTransaction } from '@/application/contracts';

export class DbTransactionController {
  constructor(private readonly decoratee: Controller, private readonly db: DbTransaction) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
    try {
      await this.decoratee.perform(httpRequest);
      await this.db.commit();
    } catch (error) {
      await this.db.rollback();
    } finally {
      await this.db.closeTransaction();
    }
  }
}
