#!/usr/bin/env node
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import {optionDefinitions, sections} from './cli-options';
import {commands, Commands, InlineConfig} from "./types";

const mainDefinitions = [{ name: 'command', defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true });
const argv = mainOptions._unknown || [];

const config = commandLineArgs(optionDefinitions, {
    camelCase: true,
    argv
}) as InlineConfig;
const { help } = config;

if (help) {
    const usage = commandLineUsage(sections);
    // Don't delete, it's the help menu
    console.log(usage);
    process.exit();
}
const command: Commands = mainOptions['command'] || 'create';

if (!Object.prototype.hasOwnProperty.call(commands, command)) {
    console.log(`Command "${command}" not found.`);
    const availableCommands = Object.keys(commands).map(key => `'${key}'`).join(' | ');
    console.log(`Please provide a command: ${availableCommands}.`);
    process.exit();
}

commands[command](config);
