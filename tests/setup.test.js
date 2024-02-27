const { KohanaJS } = require('kohanajs');
KohanaJS.initConfig(new Map([
  ['liquidjs', require('../config/liquidjs')],
]));

KohanaJS.classPath.set('LiquidTags.js', require('../classes/LiquidTags'));
KohanaJS.classPath.set('LiquidFilters.js', require('../classes/LiquidFilters'));
KohanaJS.classPath.set('helpers/Config.js', require('../classes/helpers/Config'));
KohanaJS.classPath.set('helpers/Liquid.js', require('../classes/helpers/Liquid'));
KohanaJS.classPath.set('liquid-tags/Schema.js', require('../classes/liquid-tags/Schema'));
KohanaJS.classPath.set('liquid-tags/Section.js', require('../classes/liquid-tags/Section'));

const LiquidView = require('../classes/LiquidView');

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
    const view = new LiquidView('layout/test', { content: ' world' }, `${__dirname}/views`);
    const result = await view.render();
    expect(result).toBe('hello world');
  });

  test('form tag', async () => {
    const view = new LiquidView('layout/form', { type: 'activate_customer_password' }, `${__dirname}/views`);
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
});
