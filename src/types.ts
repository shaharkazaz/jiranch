import {init} from "./init";
import {createJiraBranch} from "./create-branch";
import {clearConfig} from "./clear-config";

export interface Config {
    email: string;
    userId: string;
    token: string;
}

export interface InlineConfig {
    help: boolean;
    selectSprint: boolean;
    skipCheckout: boolean;
    skipStatusUpdate: boolean;
}

export type Commands = 'init' | 'create' | 'clear';
export type CommandsMap = Record<Commands, (config: InlineConfig) => void>;

export const commands: CommandsMap = {
    init,
    create: createJiraBranch,
    clear: clearConfig
}
