import {
  createConnection,
  getConnectionManager,
  getConnection,
  Connection,
  QueryRunner,
} from 'typeorm';

import { ConnectionNoFoundError } from '@/infra/repos/postgres/helpers';

export class PgConnection {
  private static instance?: PgConnection;
  private query?: QueryRunner;

  private constructor() {}

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection();
    }
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const isConnectionActive = getConnectionManager().has('default');
    const connection: Connection = isConnectionActive ? getConnection() : await createConnection();
    this.query = connection.createQueryRunner();
  }

  async disconnect(): Promise<void> {
    if (!this.query) throw new ConnectionNoFoundError();
    await getConnection().close();
    this.query = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.query) throw new ConnectionNoFoundError();
    await this.query.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.query) throw new ConnectionNoFoundError();
    await this.query.release();
  }

  async commit(): Promise<void> {
    if (!this.query) throw new ConnectionNoFoundError();
    await this.query.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.query) throw new ConnectionNoFoundError();
    await this.query.rollbackTransaction();
  }
}
