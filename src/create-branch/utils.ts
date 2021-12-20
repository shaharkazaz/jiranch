import {Response} from 'node-fetch';
import {getConfigStore} from "../shared";
import {JiraConfig} from "../types";
import {exec as _exec} from 'child_process';
import util from 'util';

export const exec = util.promisify(_exec);

export function toJson(res: Response) {
    return res.json();
}

export function sprintDisplayName(sprint: number) {
    return sprint + 7;
}

export function getConfig() {
    return getConfigStore().all as JiraConfig;
}

export function getHeaders() {
    const {email,token} = getConfig();
    const base64Token = Buffer.from(`${email}:${token}`).toString('base64');
    const Authorization = `Basic ${base64Token}`;

    return { 'Content-Type': 'application/json', Authorization };
}

export function sanitizeBranchName(branchName: string): string {
    let sanitized = branchName.trim().toLowerCase().replace(/[\W_]+/g,"-").substring(0, 63);

    if (lastChar(sanitized) === '-') {
        // remove trailing dash
        sanitized = sanitized.substring(0, sanitized.length - 1);
    }

    return sanitized;
}

export function lastChar(str: string): string {
    return str ? str.charAt(str.length - 1): '';
}

export function jiraApi(path: string) {
    return `https://lumigo.atlassian.net/rest/api/3/${path}`;
}

export function pluck<T>(prop: keyof T) {
    return (v: T) => v[prop];
}

export function tagBranch(branchName: string, tag: string | null) {
    return tag ? branchName.replace(/(RD-\d+)/, `$1-${tag}`) : branchName
}
