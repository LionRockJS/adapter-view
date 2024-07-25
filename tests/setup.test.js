import url from "node:url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');
console.log(__dirname);

import { Central } from '@lionrockjs/central';
import LiquidView from '../classes/LiquidView';
import LiquidTags from '../classes/LiquidTags'
import LiquidFilters from "../classes/LiquidFilters";
import HelperConfig from '../classes/helpers/Config';
import HelperLiquid from '../classes/helpers/Liquid';
import Schema from '../classes/liquid-tags/Schema';
import Section from '../classes/liquid-tags/Section';

Central.initConfig(new Map([
  ['liquidjs', await import('../config/liquidjs')],
]));

Central.classPath.set('LiquidTags.mjs', LiquidTags);
Central.classPath.set('LiquidFilters.mjs', LiquidFilters);
Central.classPath.set('helpers/Config.mjs', HelperConfig);
Central.classPath.set('helpers/Liquid.mjs', HelperLiquid);
Central.classPath.set('liquid-tags/Schema.mjs', Schema);
Central.classPath.set('liquid-tags/Section.mjs', Section);


describe('setup liquid', () => {
  test('setup', async () => {
    const view = new LiquidView(`${__dirname}/views/layout/test`, {});
    const result = await view.render();
    expect(result).toBe('hello');
  });

  test('insert content', async () => {
    const view = new LiquidView(`${__dirname}/views/layout/test`, { content: ' world' });
    const result = await view.render();
    expect(result).toBe('hello world');
  });

  test('filters', async () => {
    const view = new LiquidView(`${__dirname}/views/layout/test1`, {
      text: ' world', money: 100, camelCase: 'Not One Less', script: 'fd', css: 'fff', url: 'foo', obj: { foo: 'bar' }, exp: true, exp2: false,
    });

    const result = await view.render();

    expect(result.replace(/\r?\n|\r/g, '')).toBe(
      'hellot( world)HK$100.00100NotOneLess<script src="fd" type="text/javascript"></script><link type="text/css" href="fff" rel="stylesheet"/>/assets/foo//cdn.shopify.com/s/shopify/foo{"foo":"bar"}TRUEFALSE',
    );
  });

  test('setup with theme path', async () => {
    Central.VIEW_PATH = `${__dirname}/views`;
    const view = new LiquidView('layout/test', { content: ' world' });
    const result = await view.render();
    expect(result).toBe('hello world');
  });

  test('form tag', async () => {
    Central.VIEW_PATH = `${__dirname}/views`;
    const view = new LiquidView('layout/form', { type: 'activate_customer_password' });
    const result = await view.render();
    expect(result.replace(/\r?\n|\r/g, '')).toBe('<form method="post" accept-charset="UTF-8" action="https://my-shop.myshopify.com/account/activate" ><input name="form_type" type="hidden" value="block"/><input name="utf8" type="hidden" value="%E2%9C%93"/>  ...</form>');
  });

  test('paginate', async () => {
    const view = new LiquidView(`${__dirname}/views/layout/paginate`, { collection: { products: [{ name: 'foo' }, { name: 'bar' }, { name: 'tar' }, { name: 'nar' }] } });
    const result = await view.render();
    expect(result.replace(/\r?\n|\r/g, '')).toBe('      foo      bar      tar      nar  ');
  });

  test('render', async () => {
    const view = new LiquidView(`${__dirname}/views/layout/test2`, { title: "foo"});
    const result = await view.render();
    expect(result.replace(/\r?\n|\r/g, '')).toBe('<h1>foo</h1><div>    <div>hello</div></div>');
  })

  test('json', async() =>{
    const view  = new LiquidView(`${__dirname}/views/templates/test`, {item: {title: 'foo', description: 'bar'}});
    const result = await view.render();
    expect(result).toBe('hero Hellofoo\nhero Lorem LipsumHello worldwonderfulfoo');
  })
});
