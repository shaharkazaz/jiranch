import {getConfig, getHeaders, jiraApi, toJson} from "./utils";
import {InlineConfig, Sprint} from "../types";
import ora from "ora";

function resolveJql({allIssues}: InlineConfig, sprintId: number) {
    const {userId} = getConfig();
    let jql = `search?jql=`;
    jql += `Sprint = ${sprintId} AND assignee in (${userId})`;
    if (!allIssues) {
        // Filter done issues
        jql += ` AND status in (${getConfig().todoStatuses})`;
    }
    jql += ' order by created DESC';

    return jql;
}

export async function fetchIssues(config: InlineConfig, sprint: Sprint) {
    const loadingIssues = ora('Loading sprint issues...').start();
    const url = jiraApi({path: resolveJql(config, sprint.id)});
    const fetch = require('node-fetch');

    const res = await fetch(url, {
        headers: getHeaders()
    }).then(toJson);

    if (res.errorMessages) {
        loadingIssues.stop();
        throw new Error(res.errorMessages);
    }

    loadingIssues.succeed( `Sprint "${sprint.name}" issues loaded.`);
    const subtasks = res.issues.map((issue: any) => issue.fields.subtasks).flat();

    return {
        sprint,
        issues: [...res.issues, ...subtasks]
    };
}
