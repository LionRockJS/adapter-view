import { Central } from '@lionrockjs/central';
import config from './config/liquidjs.mjs';

Central.initConfig(new Map([
  ['liquid', config],
]));