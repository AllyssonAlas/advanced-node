import { createConnection } from 'typeorm';

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
    const connection = await createConnection();
    connection.createQueryRunner();
  }
}
