import fs from "node:fs";
import path from "node:path";
import { View } from "@lionrockjs/mvc";
import { Central } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';

import HelperConfig from './helpers/Config';
import HelperLiquid from './helpers/Liquid';

export default class LiquidView extends View {
  realPath = "";
  themePath = "";

  constructor(file, data = {}, themeDirectory = null) {
    super(`${file}.liquid`, data);

    this.themePath = themeDirectory;
    // load settings
    const settings = HelperConfig.loadSettings(this.themePath, this.sectionFile);
    Object.assign(this.data, { settings: settings.current });

    if (!this.themePath) {
      const fetchedView = Central.resolveView(this.file);

      // file can be full path or partial path in KohanaJS View folder
      // match views folder,
      if (/[\\/]views[\\/]/i.test(fetchedView)) {
        this.themePath = path.normalize(fetchedView.replace(/[\\/]views[\\/].+$/, '/views'));
      } else {
        this.themePath = path.normalize(path.dirname(fetchedView));
      }

      this.realPath = fetchedView;
    } else {
      this.realPath = path.normalize(`${this.themePath}/${this.file}`);
      Central.viewPath.set(this.realPath, this.realPath);
    }

    if (!View.caches[this.realPath]) {
      View.caches[this.realPath] = this.setupLiquidEngine();
    }
  }

  setupLiquidEngine() {
    const root = [`${this.themePath}/snippets`, `${this.themePath}/templates`, `${Central.VIEW_PATH}/snippets`];
    const engine = new Liquid({
      root,
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

  async render() {
    const { engine, template } = ( Central.config.view?.cache) ?
      (View.caches[this.realPath] || this.setupLiquidEngine()) :
      this.setupLiquidEngine();
    return engine.render(template, this.data);
  }
}