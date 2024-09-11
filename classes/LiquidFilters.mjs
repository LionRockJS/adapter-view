/**
 // Usage: {{ 1 | add: 2, 3 }}
 engine.registerFilter('add', (initial, arg1, arg2) => initial + arg1 + arg2)
 */
import pluralize from 'pluralize';
pluralize.addPluralRule('person', 'persons');
import HelperTranslate from './helpers/translate.mjs';

const camelCase = str => str
  .replace(/-/g, ' ')
  .replace(/\s(.)/g, $1 => $1.toUpperCase())
  .replace(/\s/g, '')
  .replace(/^(.)/, $1 => $1.toUpperCase());

export default {
  t: v => `${HelperTranslate.t(v)}`,
  money: v => new Intl.NumberFormat('en', { style: 'currency', currency: 'HKD' }).format(v),
  moneyWithoutCurrency: v => new Intl.NumberFormat('en', { style: 'decimal' }).format(v),
  camelcase: camelCase,
  script_tag: v => `<script src="${v}" type="text/javascript"></script>`,
  stylesheet_tag: v => `<link type="text/css" href="${v}" rel="stylesheet"/>`,
  asset_url: v => `/assets/${v}`,
  shopify_asset_url: v => `//cdn.shopify.com/s/shopify/${v}`,
  if: (v, arg1, arg2) => (v ? arg1 : arg2),
  singular: v => pluralize.singular(v),
  plural: v => pluralize.plural(v),
  within: (v, collection) => `/collections/${collection.handle}${v}`,
  toTime: v => v ? Math.floor(new Date(/\+/.test(v) ? v: v+'Z').getTime() / 1000) : '',
  consoleLog: v => console.log(v),
  parse_json: v => JSON.parse(v),
  map_get: (v, arg1) => v.get(arg1),
  format_address: v => `<p>${v.first_name} ${v.last_name}<br>${v.address1}<br>${v.city}<br>${v.province}<br>${v.country}</p>`
};
