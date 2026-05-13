import LiquidView from './LiquidView.mjs';
import LiquidTags from './LiquidTags.mjs';
import LiquidFilters from './LiquidFilters.mjs';
import LiquidTagsForm from './liquid-tags/Form.mjs';
import LiquidTagsPaginate from './liquid-tags/Paginate.mjs';
import LiquidTagsSchema from './liquid-tags/Schema.mjs';
import LiquidTagsSection from './liquid-tags/Section.mjs';
import LiquidTagsStub from './liquid-tags/Stub.mjs';
import LiquidTagsStyle from './liquid-tags/Style.mjs';
import LiquidTagsTag from './liquid-tags/Tag.mjs';
import LiquidHelperConfig from './helpers/Config.mjs';
import LiquidHelperLiquid from './helpers/Liquid.mjs';
import HelperTranslate from './helpers/Translate.mjs';

// run once
import { View } from '@lionrockjs/central';
View.DefaultViewClass = LiquidView;

export default {
  filename: import.meta.url,
  configs: ['liquidjs']
}

export {
  LiquidView,
  LiquidTags,
  LiquidFilters,
  LiquidTagsForm,
  LiquidTagsPaginate,
  LiquidTagsSchema,
  LiquidTagsSection,
  LiquidTagsStub,
  LiquidTagsStyle,
  LiquidTagsTag,
  LiquidHelperConfig,
  LiquidHelperLiquid,
  HelperTranslate,
}
