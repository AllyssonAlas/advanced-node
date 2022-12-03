import {
  createConnection,
  getConnectionManager,
  getConnection,
  Connection,
  QueryRunner,
  Repository,
  ObjectType,
} from 'typeorm';

import { ConnectionNotFoundError } from '@/infra/repos/postgres/helpers';

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
    if (!this.query) throw new ConnectionNotFoundError();
    await getConnection().close();
    this.query = undefined;
  }

  async openTransaction(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    await this.query.startTransaction();
  }

  async closeTransaction(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    await this.query.release();
  }

  async commit(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    await this.query.commitTransaction();
  }

  async rollback(): Promise<void> {
    if (!this.query) throw new ConnectionNotFoundError();
    await this.query.rollbackTransaction();
  }

  getRepository<Entity extends ObjectType<Entity>>(entity: ObjectType<Entity>): Repository<Entity> {
    if (!this.query) throw new ConnectionNotFoundError();
    return this.query.manager.getRepository(entity);
  }
}
