import {
  createConnection,
  getConnectionManager,
  getConnection,
  Connection,
  QueryRunner,
  Repository,
  ObjectType,
  ObjectLiteral,
  getRepository,
} from 'typeorm';

import { ConnectionNotFoundError, TransactionNotFoundError } from '@/infra/repos/postgres/helpers';

export class PgConnection {
  private static instance?: PgConnection;
  private query?: QueryRunner;
  private connection?: Connection;

  private constructor() {}

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection();
    }
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    const isConnectionActive = getConnectionManager().has('default');
    this.connection = isConnectionActive ? getConnection() : await createConnection();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) throw new ConnectionNotFoundError();
    await getConnection().close();
    this.query = undefined;
    this.connection = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.connection) throw new ConnectionNotFoundError();
    this.query = this.connection.createQueryRunner();
    await this.query.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    await this.query.release();
  }

  async commit(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    await this.query.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.query) throw new TransactionNotFoundError();
    await this.query.rollbackTransaction();
  }

  getRepository<Entity extends ObjectLiteral>(entity: ObjectType<Entity>): Repository<Entity> {
    if (!this.connection) throw new ConnectionNotFoundError();
    if (this.query) return this.query.manager.getRepository(entity);
    return getRepository(entity);
  }
}
