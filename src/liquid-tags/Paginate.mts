export default {
  type: 'block',

  parse(token: any, remainTokens: any) {
    (this as any).templates = [];
    const stream = (this as any).liquid.parser.parseStream(remainTokens)
      .on('start', () => {
      })
      .on('template', (tpl: any) => {
        (this as any).templates.push(tpl);
      })
      .on('tag:endpaginate', (tpl: any) => {
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  },

  * render(ctx: any, emitter: any) {
    const r = (this as any).liquid.renderer;
    yield r.renderTemplates((this as any).templates, ctx, emitter);
  },
};
