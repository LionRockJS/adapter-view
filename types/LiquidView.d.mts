import { View } from "@lionrockjs/central";
import { Liquid } from 'liquidjs';
export default class LiquidView extends View {
    static moduleSnippets: Set<string>;
    realPath: string;
    themePath: string;
    jsonTemplate: boolean;
    file: string;
    sectionFile: string;
    resolveView(file: string, default_file?: string): string;
    constructor(file: string, data?: any, default_file?: string);
    getEngine(extraRoot?: string[]): Liquid;
    liquidRender(): Promise<any>;
    static parseSettings(engine: any, node: any, data: any): Promise<void>;
    readJSON(file: string): any;
    jsonRender(): Promise<any>;
    render(): Promise<any>;
}
