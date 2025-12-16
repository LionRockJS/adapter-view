import stub from './liquid-tags/Stub.mjs';
import Style from './liquid-tags/Style.mjs';
import Schema from './liquid-tags/Schema.mjs';
declare const _default: {
    form: {
        type: string;
        parse(token: any, remainTokens: any): void;
        render(ctx: any, emitter: any): Generator<any, void, unknown>;
    };
    paginate: {
        type: string;
        parse(token: any, remainTokens: any): void;
        render(ctx: any, emitter: any): Generator<any, void, unknown>;
    };
    stub: typeof stub;
    tag: {
        html: string[];
        liquid: any;
        parse(token: any, remainTokens: any): void;
        render(ctx: any, emitter: any): Generator<never, void, unknown>;
    };
    Style: typeof Style;
    Schema: typeof Schema;
};
export default _default;
