import { ConnectionOptions } from 'typeorm';

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'babar.db.elephantsql.com',
  port: 5432,
  username: 'bssqpfxu',
  password: '5ElPCzt9rGrvXxCLf572epQUBNlDbq41',
  database: 'bssqpfxu',
  entities: ['dist/infra/postgres/entities/index.js'],
};
