import fs from 'node:fs';
import { Liquid } from 'liquidjs';
import { Central } from '@lionrockjs/central';
import TagSchema from './Schema';
import HelperLiquid from "../helpers/Liquid.mjs";
import HelperConfig from "../helpers/Config.mjs";

// {% section %} have it's context, create another liquid instance to handle it.

export default class SectionTag {
  constructor(themePath) {
    this.themePath = themePath;
  }

  parse(token) {
    this.token = token;
    const args = token.args.split(',').map(x => x.trim());
    this.sectionFile = args[0].replace(/(^')|('$)/gi, '');
    this.file = `${this.themePath}/sections/${this.sectionFile}.liquid`;
    this.content = fs.readFileSync(this.file, 'utf8');

    //        console.log('section',  this.liquid.options.globals, this.sectionFile);
    this.engine = new Liquid({
      root: `${this.themePath}/snippets/`,
      extname: '.liquid',
      cache: !!Central.config.view.cache,
      globals: this.liquid.options.globals,
    });
    HelperLiquid.registerTags(this.engine);

    this.engine.registerTag('schema', new TagSchema(this.themePath, { section: this.sectionFile, sectionConfig: this.config }));
    this.template = this.engine.parse(this.content);
  }

  async render(ctx, emitter) {
    // load config
    const settings = HelperConfig.loadSectionSettings(this.themePath, this.sectionFile);

    // TODO: block settings

    emitter.write(`<div id="shopify-section-${this.sectionFile}" class="shopify-section">`);
    emitter.write(await this.engine.render(this.template, { section: { id: this.sectionFile, settings } }));
    emitter.write('</div>');
  }
}