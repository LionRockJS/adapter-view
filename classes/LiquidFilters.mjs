import crypto from 'node:crypto';
export default {
    money: (v, arg1 = "HKD", arg2 = "en") => new Intl.NumberFormat(arg2, { style: 'currency', currency: arg1 }).format(parseInt(v) / 100),
    money_without_currency: (v, arg2 = "en") => new Intl.NumberFormat(arg2, { style: 'decimal' }).format(parseInt(v) / 100),
    script_tag: (v) => `<script src="${v}" type="text/javascript"></script>`,
    stylesheet_tag: (v) => `<link type="text/css" href="${v}" rel="stylesheet"/>`,
    asset_url: (v) => `/assets/${v}`,
    if: (v, arg1, arg2) => (v ? arg1 : arg2),
    within: (v, collection) => `/collections/${collection.handle}${v}`,
    to_time: (v) => v ? Math.floor(new Date(/\+/.test(v) ? v : v + 'Z').getTime() / 1000) : '',
    console_log: (v) => console.log(v),
    parse_json: (v) => JSON.parse(v),
    map_get: (v, arg1) => v.get(arg1),
    format_address: (v) => `<p>${v.first_name} ${v.last_name}<br>${v.address1}<br>${v.city}<br>${v.province}<br>${v.country}</p>`,
    md5: (v) => crypto.createHash('md5').update(v).digest('hex'),
    random: (v) => Math.floor(Math.random() * v),
    uuid: (v) => crypto.randomUUID(),
};
