import {
  createConnection,
  getConnectionManager,
  getConnection,
  Connection,
  QueryRunner,
} from 'typeorm';

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
    await getConnection().close();
    this.query = undefined;
  }
}
