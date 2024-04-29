import { Central } from '@lionrockjs/central';
import config from './config/liquidjs.mjs';

await Central.initConfig(new Map([
  ['liquid', config],
]));