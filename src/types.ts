import {init} from "./init";
import {createJiraBranch} from "./create-branch";
import {clearConfig} from "./clear-config";

export interface JiraConfig {
    email: string;
    userId: string;
    token: string;
}

export interface InlineConfig {
    help: boolean;
    selectSprint: boolean;
    skipCheckout: boolean;
    skipStatusUpdate: boolean;
    allIssues: boolean;
    ninja: boolean;
}

export interface Options extends InlineConfig {
    branchName: string;
    issueId: string;
    tag: string | null;
}

export type Commands = 'init' | 'create' | 'clear';
export type CommandsMap = Record<Commands, (config: InlineConfig) => void>;

export const commands: CommandsMap = {
    init,
    create: createJiraBranch,
    clear: clearConfig
}
