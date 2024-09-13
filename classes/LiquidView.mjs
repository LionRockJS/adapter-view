import fs from "node:fs";
import path from "node:path";
import { Central, View } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';

import HelperConfig from './helpers/Config.mjs';
import HelperLiquid from './helpers/Liquid.mjs';

export default class LiquidView extends View {
  realPath = "";
  themePath = "";
  jsonTemplate = false;

  resolveView(file, default_file="") {
    let fetchedView;
    try{
      this.file = file + '.liquid';
      fetchedView = Central.resolveView(this.file);
    }catch(e){
      try{
        this.file = file + '.json';
        fetchedView = Central.resolveView(this.file);
        this.jsonTemplate = true;
      }catch(e){
        if(default_file === "")throw e;
        fetchedView = this.resolveView(default_file);
        const ext = this.file.split('.').pop();
        Central.viewPath.set(file + '.' + ext, fetchedView);
      }
    }
    return fetchedView;
  }

  constructor(file, data = {}, default_file="") {
    super(`${file}.liquid`, data, default_file);

    this.realPath = this.resolveView(file, default_file);
    //theme path may not in central view folder, eg: view in modules
    this.themePath = (/[\\/]views[\\/](layout|templates|sections)[\\/]/i.test(this.realPath)) ?
      path.normalize(this.realPath.replace(/[\\/]views[\\/](layout|templates|sections)[\\/].+$/, '/views')) :
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

    HelperLiquid.registerFilterTags(engine, this.data);

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
    const engine = new Liquid();

    await Promise.all(
      Object.keys(template.sections).map(async it => {
        const section = {};
        const data = template.sections[it];
        section.type = data.type;
        section.blocks = (data.block_order ?? []).map(it => data.blocks[it]);
        section.settings = data.settings;
        section.id = it;

        //regexp test email

        //replace liquid in section settings
        await Promise.all(
          Object.keys(section.settings).map(async key => {
            //regexp check double curly braces
            if(/{{.*}}/.test(section.settings[key])){
              section.settings[key] = await engine.render(
                engine.parse(section.settings[key]),
                this.data
              );
            }
          })
        )

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