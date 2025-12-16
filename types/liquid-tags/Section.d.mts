export default class SectionTag {
    themePath: string;
    token: any;
    sectionFile: string;
    file: string;
    content: string;
    engine: any;
    template: any;
    config: any;
    liquid: any;
    constructor(themePath: string);
    parse(token: any): void;
    render(ctx: any, emitter: any): Promise<void>;
}
