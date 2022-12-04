import { Controller } from '@/application/controllers';
import { DbTransaction } from '@/application/contracts';
import { HttpResponse } from '@/application/helpers';

export class DbTransactionController {
  constructor(private readonly decoratee: Controller, private readonly db: DbTransaction) {}

  async perform(httpRequest: any): Promise<HttpResponse | undefined> {
    await this.db.openTransaction();
    try {
      const httpResponse = await this.decoratee.perform(httpRequest);
      await this.db.commit();
      return httpResponse;
    } catch {
      await this.db.rollback();
    } finally {
      await this.db.closeTransaction();
    }
  }
}
