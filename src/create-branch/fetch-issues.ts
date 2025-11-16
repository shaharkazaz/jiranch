import {getConfig, getHeaders, jiraApi, toJson} from "./utils";
import {InlineConfig, Sprint} from "../types";
import ora from "ora";

function resolveJql({allIssues}: InlineConfig, sprintId?: number) {
    const {userId} = getConfig();
    // TODO filter by specific project when in kanban
    let jql = [];
    if (sprintId) {
        jql.push(`Sprint = ${sprintId}`);
    }
    jql.push(`assignee in (${userId})`);
    if (!allIssues) {
        jql.push(`status in (${getConfig().todoStatuses})`);
    }

    return `${jql.join(' AND ')} order by created DESC`;
}

export async function fetchIssues(config: InlineConfig, sprint?: Sprint) {
    const loadingIssues = ora('Loading sprint issues...').start();
    const url = jiraApi({path: 'search/jql'});
    const jql = resolveJql(config, sprint?.id);
    const fetch = require('node-fetch');

    const res = await fetch(url, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            jql,
            fields: ['summary', 'status', 'subtasks', 'issuetype', 'parent']
        })
    }).then(toJson);

    if (res.errorMessages) {
        loadingIssues.stop();
        throw new Error(res.errorMessages);
    }

    const message = sprint ? `Sprint "${sprint.name}" issues loaded.` : 'Issues loaded.';
    loadingIssues.succeed(message);
    const subtasks = res.issues
        .filter((issue: any) => issue.fields?.subtasks)
        .map((issue: any) => issue.fields.subtasks)
        .flat();

    return {
        sprint,
        issues: [...res.issues, ...subtasks]
    };
}