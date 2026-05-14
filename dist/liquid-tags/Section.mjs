import { Liquid } from 'liquidjs';
import { Central } from '@lionrockjs/central';
import TagSchema from './Schema.mjs';
import HelperLiquid from "../helpers/Liquid.mjs";
import HelperConfig from "../helpers/Config.mjs";
// {% section %} have it's context, create another liquid instance to handle it.
export default class SectionTag {
    themePath;
    token;
    sectionFile = "";
    file = "";
    content = "";
    engine;
    template;
    config;
    liquid;
    constructor(themePath) {
        this.themePath = themePath;
    }
    parse(token) {
        this.token = token;
        const args = token.args.split(',').map((x) => x.trim());
        this.sectionFile = args[0].replace(/(^')|('$)/gi, '');
        this.file = `sections/${this.sectionFile}`;
        const sectionEntry = Central.viewFiles.get(this.file);
        if (!sectionEntry)
            throw new Error(`Section not found: ${this.file}`);
        this.content = sectionEntry.payload.default ?? sectionEntry.payload;
        const viewFs = {
            readFileSync(file) {
                const entry = Central.viewFiles.get(file);
                if (!entry)
                    throw new Error(`View not found: ${file}`);
                return entry.payload.default ?? entry.payload;
            },
            async readFile(file) {
                const entry = Central.viewFiles.get(file);
                if (!entry)
                    throw new Error(`View not found: ${file}`);
                return entry.payload.default ?? entry.payload;
            },
            existsSync(file) {
                return Central.viewFiles.has(file);
            },
            async exists(file) {
                return Central.viewFiles.has(file);
            },
            async contains() {
                return true;
            },
            resolve(_root, file, ext) {
                const fileKey = file.endsWith(ext) ? file.slice(0, -ext.length) : file;
                const folder = _root.split('/').pop();
                if ((folder === 'sections' || folder === 'snippets') && !fileKey.startsWith(`${folder}/`)) {
                    return `${folder}/${fileKey}`;
                }
                return fileKey;
            }
        };
        //        console.log('section',  this.liquid.options.globals, this.sectionFile);
        this.engine = new Liquid({
            root: ['snippets'],
            extname: '.liquid',
            cache: !!Central.config.view.cache,
            globals: this.liquid.options.globals,
            fs: viewFs,
        });
        HelperLiquid.registerTags(this.engine);
        this.engine.registerTag('schema', new TagSchema(this.themePath, { section: this.sectionFile, sectionConfig: this.config }, this.engine));
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
