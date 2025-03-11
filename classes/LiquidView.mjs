import fs from "node:fs";
import path from "node:path";
import { Central, View } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';
import expand from 'emmet';

import HelperConfig from './helpers/Config.mjs';
import HelperLiquid from './helpers/Liquid.mjs';

export default class LiquidView extends View {
  realPath = "";
  themePath = "";
  jsonTemplate = false;

  resolveView(file, default_file="") {
    let fetchedView;
    try{
      this.file = file + '.json';
      fetchedView = Central.resolveView(this.file);
      this.jsonTemplate = true;
    }catch(e){
      try{
        this.file = file + '.liquid';
        fetchedView = Central.resolveView(this.file);
        this.jsonTemplate = false;
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
    Object.assign(this.data, { settings: settings.current, meta: {} });
  }

  async liquidRender(){
    const engine = new Liquid({
      root: [`${Central.VIEW_PATH}/snippets`, `${this.themePath}/snippets`, `${this.themePath}/templates`],
      extname: '.liquid',
      cache: !!Central.config.view?.cache,
      globals: this.data,
    });

    HelperLiquid.registerFilterTags(engine, this.data);
    const template = engine.parse(fs.readFileSync(this.realPath, 'utf8'));

    return engine.render(template, this.data);
  }

  static async parseSettings(engine, node, data){
    if(/{{.*}}|{%.*%}/.test(node.type)){
      node.type = await engine.render(
        engine.parse(node.type),
        data
      );
    }

    for(const key of Object.keys(node.settings)){
      //regexp check double curly braces
      if(/{{.*}}|{%.*%}/.test(node.settings[key])){
        let text = await engine.render(
          engine.parse(node.settings[key]),
          data
        );

        //2nd pass for array
        if(/{{.*}}|{%.*%}/.test(text)){
          text = await engine.render(
            engine.parse(text),
            data
          );
        }

        node.settings[key] = text;
      }
    }
  }

  async jsonRender(){
    const template =  JSON.parse(fs.readFileSync(this.realPath, 'utf8'));
    this.data._sections = template.sections;

    const renders = {};
    const engine = new Liquid();

    for(const key of Object.keys(template.sections)){
      const section = template.sections[key];

      // do not render if not in order
      if(!template.order.includes(key))continue;

      //merge "#" type settings to this.data.meta
      if(/^#/.test(section.type)){
        const metaKey = section.type.replace('#', '');
        let metaEntry = this.data.meta[metaKey];

        //value in this.data.meta object is a set, if not exist, create one
        if(!metaEntry){
          metaEntry = new Set()
          this.data.meta[metaKey] = metaEntry;
        }

        //data.settings.value is array, loop and add to set
        if(Array.isArray(section.settings.value)){
          section.settings.value.forEach(it => metaEntry.add(it));
        }

        //if data.settings.value is object, merge it
        if(typeof section.settings.value === 'object'){
          Object.assign(metaEntry, section.settings.value);
        }
        continue;
      }

      section.blocks = (section.block_order ?? []).map(it => section.blocks[it]);
      section.settings = section.settings;
      section.id = key;

      //replace liquid in section settings
      await LiquidView.parseSettings(engine, section, this.data);

      //blocks settings
      await Promise.all(
        section.blocks.map(async block => LiquidView.parseSettings(engine, block, this.data))
      )

      const view = await new LiquidView('sections/' + section.type, Object.assign({}, this.data, {section}));
      renders[key] = await view.render();
    }

    let result = template.order.map(it => renders[it]).join('\n');

    if(template.wrapper){
      const escapeWrapper = template.wrapper.replaceAll('\\[', '--sbrk--').replaceAll('\\]', '--ebrk--')
      const wrapper = expand(escapeWrapper+'>span.internal_content').replaceAll('--sbrk--', '[').replaceAll('--ebrk--', ']');
      result = wrapper.replace('<span class="internal_content"></span>', result);
    }

    if(Central.config.system?.debug){
      return `<!-- view file: ${this.file} -->\n` + result;
    }

    return result;
  }

  async render() {
    if(!this.jsonTemplate) return this.liquidRender();
    return this.jsonRender();
  }
}