import fs from "node:fs";
import path from "node:path";
import { View } from "@lionrockjs/mvc";
import { Central } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';

import HelperConfig from './helpers/Config.mjs';
import HelperLiquid from './helpers/Liquid.mjs';

export default class LiquidView extends View {
  realPath = "";
  themePath = "";
  jsonTemplate = false;

  resolveView(file) {
    let fetchedView;
    try{
      fetchedView = Central.resolveView(file+ '.liquid');
    }catch(e){
      fetchedView = Central.resolveView(file + '.json');
      this.file = file + '.json';
      this.jsonTemplate = true;
    }
    return fetchedView;
  }

  constructor(file, data = {}) {
    super(`${file}.liquid`, data);

    this.realPath = this.resolveView(file);
    //theme path may not in central view folder, eg: view in modules
    this.themePath = (/[\\/]views[\\/]/i.test(this.realPath)) ?
      path.normalize(this.realPath.replace(/[\\/]views[\\/].+$/, '/views')) :
      path.normalize(path.dirname(this.realPath));

    // load settings
    const settings = HelperConfig.loadSettings(this.themePath, this.sectionFile);
    Object.assign(this.data, { settings: settings.current });

  }

  setupLiquidEngine(rootFolder) {
    const engine = new Liquid({
      root: rootFolder ?? [`${this.themePath}/snippets`, `${this.themePath}/templates`, `${Central.VIEW_PATH}/snippets`],
      extname: '.liquid',
      cache: !!Central.config.view?.cache,
      globals: this.data,
    });

    HelperLiquid.registerFilterTags(engine);

    return {
      engine,
      template: engine.parse(fs.readFileSync(this.realPath, 'utf8')),
    }
  }

  async liquidRender(){
    //try to fix sometime View.caches is not defined error;
    if (!View.caches[this.realPath]) View.caches[this.realPath] = this.setupLiquidEngine();

    if(Central.config.view?.cache) {
      const {engine, template} = View.caches[this.realPath];
      return engine.render(template, this.data);
    }

    View.caches[this.realPath] = this.setupLiquidEngine();
    return View.caches[this.realPath].engine.render(View.caches[this.realPath].template, this.data);
  }

  async jsonRender(){
    if(!View.caches[this.realPath]) View.caches[this.realPath] = JSON.parse(fs.readFileSync(this.realPath, 'utf8'));
    const template = (Central.config.view?.cache) ? View.caches[this.realPath] : JSON.parse(fs.readFileSync(this.realPath, 'utf8'));

    const renders = {};
    await Promise.all(
      Object.keys(template.sections).map(async it => {
        const section = {};
        const data = template.sections[it];
        section.type = data.type;
        section.blocks = (data.block_order ?? []).map(it => data.blocks[it]);
        section.settings = data.settings;
        section.id = it;
        const view = await new LiquidView('sections/' + section.type, Object.assign({}, {section}, this.data));
        renders[it] = await view.render();
      })
    )

    return template.order.map(it => renders[it]).join('\n');
  }

  async render() {
    if(!this.jsonTemplate) return this.liquidRender();
    return this.jsonRender();
  }
}