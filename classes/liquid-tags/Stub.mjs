export default class StubTag {
  parse(token) {
    this.token = token;
    this.tagName = this.token.name;
  }

  // eslint-disable-next-line require-yield
  * render(ctx, emitter) {
    emitter.write(`:: ${this.tagName} :: `);
  }
}
