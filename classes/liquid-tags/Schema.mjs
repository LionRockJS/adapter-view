/* schema tag should be no use, it just for configure theme from admin. */
/* maybe read it and generate config file if missing */
export default class SchemaTag {
  constructor(themePath, sectionName, options) {
    // /usr/local/var/www/dim-my/sites/localhost/themes/default/
    // { section: 'header' }
    this.themePath = themePath;
    this.sectionName = sectionName;
    this.options = options;

    //    this.settings = require(themePath+'config/settings_data.json');
  }

  parse(token, remainTokens) {
    this.branches = [];

    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        //        console.log(token.arg);

        /*        this.branches.push({
          cond: token.arg,
          templates: (p = [])
        }); */
      })
      .on('template', tpl => {
        //        schema[this.sectionName] = tpl.token.input;
      })
      .on('tag:endschema', tpl => {
        //        console.log(schema[this.sectionName]);
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  }

/*  async render(ctx, emitter) {
    return;

    const settingData = settings[this.themePath];
    if (!settingData.current) return;
    if (!settingData.current.sections) return;

    const sectionData = settingData.current.sections[this.sectionName];
    const blocks = [];

    sectionData.block_order = sectionData.block_order || [];
    sectionData.block_order.forEach(x => blocks.push(sectionData.blocks[x]));

    ctx.environments.section = {
      blocks,
      settings: sectionData.settings,
    };

    return '';
  } */
};
