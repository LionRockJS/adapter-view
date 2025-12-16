export default class StubTag {
    token: any;
    tagName: string;
    parse(token: any): void;
    render(ctx: any, emitter: any): Generator<never, void, unknown>;
}
