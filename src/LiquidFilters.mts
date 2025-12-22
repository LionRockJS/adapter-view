import crypto from 'node:crypto';

export default {
  money: (v: string, arg1: string = "HKD", arg2: string = "en") => new Intl.NumberFormat(arg2, { style: 'currency', currency: arg1 }).format(parseInt(v) / 100),
  money_without_currency: (v: string, arg2: string = "en") => new Intl.NumberFormat(arg2, { style: 'decimal' }).format(parseInt(v) / 100),
  camelcase: (v: string) => v.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase()).replace(/[\s\-_]+/g, ''),
  shopify_asset_url: (v: string) => `//cdn.shopify.com/s/shopify/${v}`,
  script_tag: (v: string) => `<script src="${v}" type="text/javascript"></script>`,
  stylesheet_tag: (v: string) => `<link type="text/css" href="${v}" rel="stylesheet"/>`,
  asset_url: (v: string) => `/assets/${v}`,
  if: (v: any, arg1: any, arg2: any) => (v ? arg1 : arg2),
  within: (v: string, collection: any) => `/collections/${collection.handle}${v}`,
  to_time: (v: string) => v ? Math.floor(new Date(/\+/.test(v) ? v: v+'Z').getTime() / 1000) : '',
  console_log: (v: any) => console.log(v),
  parse_json: (v: string) => JSON.parse(v),
  map_get: (v: Map<any, any>, arg1: any) => v.get(arg1),
  format_address: (v: any) => `<p>${v.first_name} ${v.last_name}<br>${v.address1}<br>${v.city}<br>${v.province}<br>${v.country}</p>`,
  md5: (v: string) => crypto.createHash('md5').update(v).digest('hex'),
  random: (v: number) => Math.floor(Math.random() * v),
  uuid: (v: any) => crypto.randomUUID(),
};
