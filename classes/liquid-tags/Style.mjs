export default class TagStyle {
  parse(token, remainTokens) {
    this.html = [];
    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        this.html.push('<style data-shopify>');
      })
      .on('template', tpl => {
        this.html.push(tpl.input);
      })
      .on(`tag:end${token.name}`, tpl => {
        this.html.push('</style>');
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  }

  async render(ctx, emitter) {
    emitter.write(this.html.join('\n'));
  }
}
