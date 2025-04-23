import crypto from 'node:crypto';
/**
 // Usage: {{ 1 | add: 2, 3 }}
 engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
 */

export default {
  money: v => new Intl.NumberFormat('en', { style: 'currency', currency: 'HKD' }).format(v),
  money_without_currency: v => new Intl.NumberFormat('en', { style: 'decimal' }).format(v),
  script_tag: v => `<script src="${v}" type="text/javascript"></script>`,
  stylesheet_tag: v => `<link type="text/css" href="${v}" rel="stylesheet"/>`,
  asset_url: v => `/assets/${v}`,
  if: (v, arg1, arg2) => (v ? arg1 : arg2),
  within: (v, collection) => `/collections/${collection.handle}${v}`,
  to_time: v => v ? Math.floor(new Date(/\+/.test(v) ? v: v+'Z').getTime() / 1000) : '',
  console_log: v => console.log(v),
  parse_json: v => JSON.parse(v),
  map_get: (v, arg1) => v.get(arg1),
  format_address: v => `<p>${v.first_name} ${v.last_name}<br>${v.address1}<br>${v.city}<br>${v.province}<br>${v.country}</p>`,
  md5: v => crypto.createHash('md5').update(v).digest('hex'),
  random: v => Math.floor(Math.random() * v),
  uuid: v => crypto.randomUUID(),
};
