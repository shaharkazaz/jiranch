import {getConfig, getHeaders, jiraApi, sprintDisplayName, toJson} from "./utils";
import {InlineConfig} from "../types";
import ora from "ora";

const ninjaFilterID = 10047;

function resolveJql({ninja, allIssues}: InlineConfig, sprint: number) {
    const {userId} = getConfig();
    let jql = `search?jql=`;
    jql += ninja ? `filter=${ninjaFilterID}` : `Sprint = ${sprint} AND assignee in (${userId})`;
    if (!allIssues) {
        // Filter done issues
        jql += ' AND status != Done';
    }
    jql += ' order by created DESC';

    return jql;
}

export async function fetchIssues(config: InlineConfig, sprint: number) {
    const loadingIssues = ora(config.ninja ? 'Loading Ninja issues' : 'Loading sprint issues...').start();
    const url = jiraApi(resolveJql(config, sprint));
    const fetch = require('node-fetch');

    const { issues } = await fetch(url, {
        headers: getHeaders()
    }).then(toJson);

    const msg = config.ninja ? 'Ninja' : `Sprint ${sprintDisplayName(sprint)}`;
    loadingIssues.succeed( `${msg} issues loaded.`);

    return {
        sprint,
        issues
    };
}
