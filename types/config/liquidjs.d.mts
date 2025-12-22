declare const _default: {
    tags: ({
        name: string;
        tag: import("../index.js").LiquidTagsStyle;
    } | {
        name: string;
        tag: {
            html: string[];
            liquid: any;
            parse(token: any, remainTokens: any): void;
            render(ctx: any, emitter: any): Generator<never, void, unknown>;
        };
    } | {
        name: string;
        tag: {
            type: string;
            parse(token: any, remainTokens: any): void;
            render(ctx: any, emitter: any): Generator<any, void, unknown>;
        };
    } | {
        name: string;
        tag: typeof import("../index.js").LiquidTagsSchema;
    })[];
    filters: {
        name: string;
        func: any;
    }[];
    translates: {
        en: {
            language: string;
        };
        'zh-hant': {
            language: string;
        };
        'zh-hans': {
            language: string;
        };
    };
};
export default _default;
