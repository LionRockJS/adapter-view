import Filters from '../classes/LiquidFilters.mjs';
import Tags from '../classes/LiquidTags.mjs';

export default {
  tags: [
    {name:'style', tag: new Tags.Style() },
    {name:'stylesheet', tag: new Tags.Style() },
    {name:'javascript', tag: Tags.tag },
    {name:'form', tag: Tags.form },
    {name:'paginate', tag: Tags.paginate },
  ],

  filters: [
    {name:'t', func: Filters.t },
    {name:'asset_url', func: Filters.asset_url },
    {name:'shopify_asset_url', func: Filters.shopify_asset_url },
    {name:'stylesheet_tag', func: Filters.stylesheet_tag },
    {name:'script_tag', func: Filters.script_tag },
    {name:'camelcase', func: Filters.camelcase },
    {name:'money', func: Filters.money },
    {name:'money_without_currency', func: Filters.moneyWithoutCurrency },
    {name:'if', func: Filters.if },
    {name:'plural', func: Filters.plural },
    {name:'singular', func: Filters.singular },
    {name:'within', func: Filters.within },
    {name:'to_time', func: Filters.toTime },
    {name:'parse_json', func: Filters.parse_json },
    {name:'map_get', func: Filters.map_get },
    {name:'format_address', func: Filters.format_address },
    {name:'console_log', func: v => console.log(v) },
  ],
};
