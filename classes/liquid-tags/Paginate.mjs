export default {
  type: 'block',

  parse(token, remainTokens) {
    this.templates = [];
    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
      })
      .on('template', tpl => {
        this.templates.push(tpl);
      })
      .on('tag:endpaginate', tpl => {
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  },

  * render(ctx, emitter) {
    const r = this.liquid.renderer;
    yield r.renderTemplates(this.templates, ctx, emitter);
  },
};
