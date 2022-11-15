import { addAlias } from 'module-alias';
import { resolve } from 'path';

const devEnvironment = process.env.TS_NODE_DEV === undefined;

addAlias('@', resolve(devEnvironment ? 'dist' : 'src'));
