export default class {
  html: string[] = [];
  liquid: any;

  parse(token: any, remainTokens: any) {
    this.html = [];
    const stream = (this as any).liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        this.html.push('<style data-shopify>');
      })
      .on('template', (tpl: any) => {
        this.html.push(tpl.input);
      })
      .on(`tag:end${token.name}`, (tpl: any) => {
        this.html.push('</style>');
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  }

  async render(ctx: any, emitter: any) {
    emitter.write(this.html.join('\n'));
  }
}
