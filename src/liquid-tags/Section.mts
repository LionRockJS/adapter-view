import { Liquid } from 'liquidjs';
import { Central } from '@lionrockjs/central';
import TagSchema from './Schema.mjs';
import HelperLiquid from "../helpers/Liquid.mjs";
import HelperConfig from "../helpers/Config.mjs";

// {% section %} have it's context, create another liquid instance to handle it.

export default class SectionTag {
  themePath: string;
  token: any;
  sectionFile: string = "";
  file: string = "";
  content: string = "";
  engine: any;
  template: any;
  config: any;
  liquid: any;

  constructor(themePath: string) {
    this.themePath = themePath;
  }

  parse(token: any) {
    this.token = token;
    const args = token.args.split(',').map((x: string) => x.trim());
    this.sectionFile = args[0].replace(/(^')|('$)/gi, '');
    this.file = `sections/${this.sectionFile}`;
    const sectionEntry = Central.viewFiles.get(this.file);
    if (!sectionEntry) throw new Error(`Section not found: ${this.file}`);
    this.content = sectionEntry.payload.default ?? sectionEntry.payload;

    const viewFs = {
      readFileSync(file: string): string {
        const entry = Central.viewFiles.get(file);
        if (!entry) throw new Error(`View not found: ${file}`);
        return entry.payload.default ?? entry.payload;
      },
      async readFile(file: string): Promise<string> {
        const entry = Central.viewFiles.get(file);
        if (!entry) throw new Error(`View not found: ${file}`);
        return entry.payload.default ?? entry.payload;
      },
      existsSync(file: string): boolean {
        return Central.viewFiles.has(file);
      },
      async exists(file: string): Promise<boolean> {
        return Central.viewFiles.has(file);
      },
      async contains(): Promise<boolean> {
        return true;
      },
      resolve(_root: string, file: string, ext: string): string {
        return file.endsWith(ext) ? file.slice(0, -ext.length) : file;
      }
    };

    //        console.log('section',  this.liquid.options.globals, this.sectionFile);
    this.engine = new Liquid({
      root: [''],
      extname: '.liquid',
      cache: !!Central.config.view.cache,
      globals: (this as any).liquid.options.globals,
      fs: viewFs,
    });
    HelperLiquid.registerTags(this.engine);

    this.engine.registerTag('schema', new TagSchema(this.themePath, { section: this.sectionFile, sectionConfig: this.config } as any, this.engine));
    this.template = this.engine.parse(this.content);
  }

  async render(ctx: any, emitter: any) {
    // load config
    const settings = HelperConfig.loadSectionSettings(this.themePath, this.sectionFile);

    // TODO: block settings

    emitter.write(`<div id="shopify-section-${this.sectionFile}" class="shopify-section">`);
    emitter.write(await this.engine.render(this.template, { section: { id: this.sectionFile, settings } }));
    emitter.write('</div>');
  }
}
