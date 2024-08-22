import {init} from "./init";
import {createJiraBranch} from "./create-branch";
import {clearConfig} from "./clear-config";

export interface JiraConfig {
    email: string;
    userId: string;
    boardId: number;
    token: string;
    apiPath: string;
    todoStatuses: string;
    boardType: 'scrum' | 'kanban';
}

export interface InlineConfig {
    help: boolean;
    selectSprint: boolean;
    skipCheckout: boolean;
    allIssues: boolean;
}

export interface Options extends InlineConfig {
    branchName: string;
    issueId: string;
}

export type Commands = 'init' | 'create' | 'clear';
export type CommandsMap = Record<Commands, (config: InlineConfig) => void>;

export interface Sprint {
    id: number;
    name: string;
}

export const commands: CommandsMap = {
    init,
    create: createJiraBranch,
    clear: clearConfig
}
