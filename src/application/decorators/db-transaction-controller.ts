import { DbTransaction } from '@/application/contracts';

export class DbTransactionController {
  constructor(private readonly db: DbTransaction) {}

  async perform(httpRequest: any): Promise<void> {
    await this.db.openTransaction();
  }
}
