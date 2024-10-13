export default {
  filename: import.meta.url,
  configs: ['liquidjs']
}

import LiquidView from './classes/LiquidView.mjs';
import LiquidTags from './classes/LiquidTags.mjs';
import LiquidFilters from './classes/LiquidFilters.mjs';
import LiquidTagsForm from './classes/liquid-tags/Form.mjs';
import LiquidTagsPaginate from './classes/liquid-tags/Paginate.mjs';
import LiquidTagsSchema from './classes/liquid-tags/Schema.mjs';
import LiquidTagsSection from './classes/liquid-tags/Section.mjs';
import LiquidTagsStub from './classes/liquid-tags/Stub.mjs';
import LiquidTagsStyle from './classes/liquid-tags/Style.mjs';
import LiquidTagsTag from './classes/liquid-tags/Tag.mjs';
import LiquidHelperConfig from './classes/helpers/Config.mjs';
import LiquidHelperLiquid from './classes/helpers/Liquid.mjs';
import HelperTranslate from './classes/helpers/Translate.mjs';

export{
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