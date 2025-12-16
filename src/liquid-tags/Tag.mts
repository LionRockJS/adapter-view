export default {
  html: [] as string[],
  liquid: null as any,

  parse(token: any, remainTokens: any) {
    const startTagMap: {[key: string]: string} = {
      stylesheet: '<style>',
      javascript: '<script type="text/javascript">//<![CDATA[',
    };

    const endTagMap: {[key: string]: string} = {
      stylesheet: '</style>',
      javascript: '//]]></script>',
    };

    (this as any).html = [];
    const stream = (this as any).liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        (this as any).html.push(startTagMap[token.name] || `TODO TAG: ${token.name} `);
      })
      .on('template', (tpl: any) => {
        (this as any).html.push(tpl.value);
      })
      .on(`tag:end${token.name}`, (tpl: any) => {
        (this as any).html.push(endTagMap[token.name] || '');
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  },
  // eslint-disable-next-line require-yield
  * render(ctx: any, emitter: any) {
    emitter.write((this as any).html.join('\n'));
  },
};
