import HelperTranslate from '../classes/helpers/translate.mjs';
import {Central} from '@lionrockjs/central';
import config from '../config/liquidjs.mjs';
Central.config.liquidjs = config;
Central.config.liquidjs.translates = {
  'en': { 'language': 'English', foo: {name:"foo"} },
  'zh-hant': { 'language': '繁體中文', foo: {name:"扶"} },
  'zh-hans': { 'language': '简体中文', foo: {name:"夫"} },
}
describe('translate', () => {

  test('create value', async () => {
    HelperTranslate.update();
    expect(HelperTranslate.t('language')).toBe('English');
    expect(HelperTranslate.t('foo.name')).toBe('foo');

    expect(HelperTranslate.t('language', 'zh-hant')).toBe('繁體中文');
    expect(HelperTranslate.t('foo.name', 'zh-hant')).toBe('扶');

    expect(HelperTranslate.t('language', 'zh-hans')).toBe('简体中文');
    expect(HelperTranslate.t('foo.name', 'zh-hans')).toBe('夫');
  })
});