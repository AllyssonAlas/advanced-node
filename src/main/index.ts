import './config/module-alias';

import 'reflect-metadata';

import { env } from '@/main/config/env';
import { createConnection, getConnectionOptions } from 'typeorm';

getConnectionOptions()
  .then(async (options) => {
    const devEnvironment = process.env.TS_NODE_DEV === undefined;
    const root = devEnvironment ? 'src' : 'dist';
    const entities = [`${root}/infra/postgres/entities/index.{js,ts}`];
    await createConnection({ ...options, entities });
    const { app } = await import('@/main/config/app');
    app.listen(env.port, () => console.log(`Server running at http://localhost:${env.port}`));
  })
  .catch(console.error);
