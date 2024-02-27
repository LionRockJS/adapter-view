const { KohanaJS } = require('kohanajs');
KohanaJS.initConfig(new Map([
  ['liquidjs', require('./config/liquidjs')],
]));