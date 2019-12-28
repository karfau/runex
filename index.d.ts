#! /usr/bin/env node
/**
 * A Module that exports a method named `run`.
 */
export type RunnableModule = NodeModule & {
    run: Function;
};
/**
 * Available CLI options for runex.
 *
 * Usage information: `npx runex -h|--help`
 */
export type Options = {
    require: string[];
};
export namespace ExitCode {
    export const MissingArgument: number;
    export const ModuleNotFound: number;
    export const InvalidModuleExport: number;
    export const ExportThrows: number;
}
export function exitWithUsage(printUsage: Function, code: number): () => never;
export function parseArguments(argv: string[]): {
    args: string[];
    moduleNameOrPath: string;
    opts: {
        require: string[];
    };
};
export function requireRunnable(possiblePaths: string[], opts: {
    require: string[];
}, _require?: NodeRequire | undefined): NodeModule & {
    run: Function;
};
export function resolveRelativeAndRequirePaths(moduleNameOrPath: string): string[];
export function run(runnable: NodeModule & {
    run: Function;
}, { args }?: {
    args: any[];
    opts: {
        require: string[];
    };
} | undefined): Promise<any>;
