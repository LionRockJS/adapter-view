import { Central } from '@lionrockjs/central';
import config from './config/liquidjs.mjs?';
import {HelperTranslate} from "./index.js";

await Central.initConfig(new Map([
  ['liquidjs', config],
]));