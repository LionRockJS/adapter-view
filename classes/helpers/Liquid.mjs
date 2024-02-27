import { Central } from '@lionrockjs/central';

export default class HelperLiquid {
  static registerFilterTags(engine){
    if(!Central.config.liquidjs) return;
    Central.config.liquidjs.filters.forEach(filter => engine.registerFilter(filter.name, filter.func));
    Central.config.liquidjs.tags.forEach(tag =>engine.registerTag(tag.name, tag.tag));
  }
}