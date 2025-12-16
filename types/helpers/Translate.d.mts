export default class Translate {
    static values: Map<any, any>;
    static update(): void;
    static setKey(key: string, value: any, language?: string): void;
    static t(key: string, language?: string): any;
}
