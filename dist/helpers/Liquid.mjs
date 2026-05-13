import { Central } from '@lionrockjs/central';
import HelperTranslate from "./Translate.mjs";
export default class HelperLiquid {
    static cacheId = -1;
    static registerFilterTags(engine, data) {
        if (!Central.config.liquidjs)
            return;
        Central.config.liquidjs.filters.forEach((filter) => engine.registerFilter(filter.name, filter.func));
        Central.config.liquidjs.tags.forEach((tag) => engine.registerTag(tag.name, tag.tag));
        if (this.cacheId !== Central.cacheId)
            HelperTranslate.update();
        engine.registerFilter('t', (v) => `${HelperTranslate.t(v, data.language)}`);
    }
    static registerTags(engine) {
        // Placeholder for missing method called in Section.ts
    }
}
