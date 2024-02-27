export default {
  parse(token, remainTokens) {
    const startTagMap = {
      stylesheet: '<style>',
      javascript: '<script type="text/javascript">//<![CDATA[',
    };

    const endTagMap = {
      stylesheet: '</style>',
      javascript: '//]]></script>',
    };

    this.html = [];
    const stream = this.liquid.parser.parseStream(remainTokens)
      .on('start', () => {
        this.html.push(startTagMap[token.name] || `TODO TAG: ${token.name} `);
      })
      .on('template', tpl => {
        this.html.push(tpl.value);
      })
      .on(`tag:end${token.name}`, tpl => {
        this.html.push(endTagMap[token.name] || '');
        stream.stop();
      })
      .on('end', () => {
        throw new Error(`tag ${token.raw} not closed`);
      });

    stream.start();
  },
  // eslint-disable-next-line require-yield
  * render(ctx, emitter) {
    emitter.write(this.html.join('\n'));
  },
};
