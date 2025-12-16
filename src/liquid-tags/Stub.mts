export default class StubTag {
  token: any;
  tagName: string = "";

  parse(token: any) {
    this.token = token;
    this.tagName = this.token.name;
  }

  // eslint-disable-next-line require-yield
  * render(ctx: any, emitter: any) {
    emitter.write(`:: ${this.tagName} :: `);
  }
}
