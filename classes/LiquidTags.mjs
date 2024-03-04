/**
 *
 * tagToken:

 "trimLeft":true,
 "trimRight":true,
 "type" : "tag",
 "raw" : "{%- form 'product', _product, class : form_classes, novalidate: 'novalidate' -%}",
 "value" : "form 'product', _product, class : form_classes, novalidate: 'novalidate'",
 "input" : ,
 "file" : "xxx.liquid",
 "name" : "form",
 "args" : "'product', _product, class : form_classes, novalidate: 'novalidate'"

 */
import form from './liquid-tags/Form.mjs';
import paginate from './liquid-tags/Paginate.mjs';
import stub from './liquid-tags/Stub.mjs';
import tag from './liquid-tags/Tag.mjs';
import Style from './liquid-tags/Style.mjs';

export default {
  form,
  paginate,
  stub,
  tag,
  Style
};
