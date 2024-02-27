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
import form from './liquid-tags/Form';
import paginate from './liquid-tags/Paginate';
import stub from './liquid-tags/Stub';
import tag from './liquid-tags/Tag';
import Style from './liquid-tags/Style';

export default {
  form,
  paginate,
  stub,
  tag,
  Style
};
