export default class {
    html: string[];
    liquid: any;
    parse(token: any, remainTokens: any): void;
    render(ctx: any, emitter: any): Promise<void>;
}
