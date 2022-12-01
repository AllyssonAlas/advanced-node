import { createConnection, getConnectionManager, getConnection, Connection } from 'typeorm';

export class PgConnection {
  private static instance?: PgConnection;

  private constructor() {}

  static getInstance(): PgConnection {
    if (PgConnection.instance === undefined) {
      PgConnection.instance = new PgConnection();
    }
    return PgConnection.instance;
  }

  async connect(): Promise<void> {
    let connection: Connection;
    if (getConnectionManager().has('default')) {
      connection = getConnection();
    } else {
      connection = await createConnection();
    }
    connection.createQueryRunner();
  }
}
