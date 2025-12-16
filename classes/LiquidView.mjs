import fs from "node:fs";
import path from "node:path";
import { Central, View } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';
import expand from 'emmet';
import HelperConfig from './helpers/Config.mjs';
import HelperLiquid from './helpers/Liquid.mjs';
export default class LiquidView extends View {
    static moduleSnippets = new Set();
    realPath = "";
    themePath = "";
    jsonTemplate = false;
    file = "";
    sectionFile = "";
    resolveView(file, default_file = "") {
        let fetchedView;
        try {
            this.file = file + '.json';
            fetchedView = Central.resolveView(this.file);
            this.jsonTemplate = true;
        }
        catch (e) {
            try {
                this.file = file + '.liquid';
                fetchedView = Central.resolveView(this.file);
                this.jsonTemplate = false;
            }
            catch (e) {
                if (default_file === "")
                    throw e;
                fetchedView = this.resolveView(default_file);
                const ext = this.file.split('.').pop();
                Central.viewPath.set(file + '.' + ext, fetchedView);
            }
        }
        return fetchedView;
    }
    constructor(file, data = {}, default_file = "") {
        super(`${file}.liquid`, data, default_file);
        this.realPath = this.resolveView(file, default_file);
        if (LiquidView.moduleSnippets.size === 0) {
            //get all node packages from Central.nodePackages
            //check if folder exists
            [...Central.nodePackages.values()].reverse().forEach((it) => {
                const sectionPath = `${it}/views/sections`;
                if (fs.existsSync(sectionPath)) {
                    LiquidView.moduleSnippets.add(sectionPath);
                }
                const snippetPath = `${it}/views/snippets`;
                if (fs.existsSync(snippetPath)) {
                    LiquidView.moduleSnippets.add(snippetPath);
                }
            });
        }
        //theme path may not in central view folder, eg: view in modules
        this.themePath = (/[\\/]views[\\/](layout|templates|sections)[\\/]/i.test(this.realPath)) ?
            path.normalize(this.realPath.replace(/[\\/]views[\\/](layout|templates|sections)[\\/].+$/, '/views')) :
            path.normalize(path.dirname(this.realPath));
        // load settings
        const settings = HelperConfig.loadSettings(this.themePath, this.sectionFile);
        if (this.data.meta === undefined)
            this.data.meta = {};
        Object.assign(this.data, { settings: settings.current });
    }
    getEngine(extraRoot = []) {
        const root = new Set([`${Central.VIEW_PATH}/sections`, `${Central.VIEW_PATH}/snippets`, ...LiquidView.moduleSnippets.values(), `${this.themePath}/sections`, `${this.themePath}/snippets`, ...extraRoot]);
        const engine = new Liquid({
            root: [...root.values()],
            extname: '.liquid',
            cache: !!Central.config.view?.cache,
            globals: this.data,
        });
        HelperLiquid.registerFilterTags(engine, this.data);
        return engine;
    }
    async liquidRender() {
        const engine = this.getEngine();
        const template = engine.parse(fs.readFileSync(this.realPath, 'utf8'));
        if (Central.config.system?.debug && this.data.debug !== false) {
            const text = await engine.render(template, this.data);
            return `<!-- view file: ${this.realPath} -->\n` + text;
        }
        else {
            return await engine.render(template, this.data);
        }
    }
    static async parseSettings(engine, node, data) {
        if (/{{.*}}|{%.*%}/.test(node.type)) {
            node.type = await engine.render(engine.parse(node.type), data);
        }
        for (const key of Object.keys(node.settings ?? {})) {
            //regexp check double curly braces
            if (/{{.*}}|{%.*%}/.test(node.settings[key])) {
                let text = await engine.render(engine.parse(node.settings[key]), data);
                //2nd pass for array
                if (/{{.*}}|{%.*%}/.test(text)) {
                    text = await engine.render(engine.parse(text), data);
                }
                node.settings[key] = text;
            }
        }
    }
    readJSON(file) {
        try {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
        catch (e) {
            throw new Error(`Error parsing JSON file: ${file}: ${e.message}`);
        }
    }
    async jsonRender() {
        const template = this.readJSON(this.realPath);
        if (!template.order || template.order.length === 0)
            return;
        const renders = {};
        const engine = this.getEngine([`${this.themePath}/sections`]);
        for (let key of template.order) {
            const section = template.sections[key];
            if (!section)
                continue;
            section.id = key;
            //merge "#" type settings to this.data.meta
            if (/^#/.test(section.type)) {
                const metaKey = section.type.replace('#', '');
                let metaEntry = this.data.meta[metaKey];
                //value in this.data.meta object is a set, if not exist, create one
                if (!metaEntry) {
                    metaEntry = new Set();
                    this.data.meta[metaKey] = metaEntry;
                }
                //data.settings.value is array, loop and add to set
                if (Array.isArray(section.settings.value)) {
                    section.settings.value.forEach((it) => metaEntry.add(it));
                }
                //if data.settings.value is object, merge it
                if (typeof section.settings.value === 'object') {
                    Object.assign(metaEntry, section.settings.value);
                }
                continue;
            }
            //replace liquid in section settings
            await LiquidView.parseSettings(engine, section, this.data);
            if (section.block_order && Array.isArray(section.block_order) && section.block_order.length > 0) {
                section.blocks = section.block_order.map((it) => section.blocks[it]);
                //blocks settings
                await Promise.all(section.blocks.map(async (block) => LiquidView.parseSettings(engine, block, this.data)));
            }
            try {
                //render view, use shared template data and section data from json
                const view = await new LiquidView('sections/' + section.type, Object.assign({}, this.data, { section }));
                renders[key] = await view.render();
            }
            catch (e) {
                throw new Error(`${this.realPath} \n Error rendering section: ${section.type}: ${e.message}`);
            }
        }
        let result = template.order.map((it) => renders[it]).join('\n');
        if (template.wrapper) {
            if (/{{.*}}|{%.*%}/.test(template.wrapper)) {
                template.wrapper = await engine.render(engine.parse(template.wrapper), this.data);
            }
            try {
                const escapeWrapper = template.wrapper.replaceAll('\\[', '--sbrk--').replaceAll('\\]', '--ebrk--');
                const wrapper = expand(escapeWrapper + '>span.internal_content').replaceAll('--sbrk--', '[').replaceAll('--ebrk--', ']');
                result = wrapper.replace('<span class="internal_content"></span>', result);
            }
            catch (e) {
                throw new Error(`Error parsing JSON template wrapper: ${this.realPath}: ${e.message}`);
            }
        }
        if (Central.config.system?.debug && this.data.debug !== false) {
            return `<!-- begin json template: ${this.realPath} -->\n` + result + `\n<!-- end json template: ${this.realPath} -->`;
        }
        return result;
    }
    async render() {
        if (!this.jsonTemplate)
            return this.liquidRender();
        return this.jsonRender();
    }
}
