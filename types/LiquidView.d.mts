import { View } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';
export default class LiquidView extends View {
    static VIEW_PATH: string;
    static moduleSnippets: Set<string>;
    resolvedView: any;
    realPath: string;
    themePath: string;
    jsonTemplate: boolean;
    sectionFile: string;
    resolveView(file: string, default_file?: string): string;
    constructor(file: string, data?: any, default_file?: string);
    private ensureSettings;
    getEngine(extraRoot?: string[]): Liquid;
    liquidRender(): Promise<any>;
    static parseSettings(engine: any, node: any, data: any): Promise<void>;
    jsonRender(): Promise<any>;
    render(): Promise<any>;
}
