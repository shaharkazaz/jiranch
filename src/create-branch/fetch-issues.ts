import fetch from 'node-fetch';
import {getConfig, getHeaders, jiraApi, toJson} from "./utils";

export async function fetchIssues(sprint: number) {
    const {userId} = getConfig();
    const url = jiraApi(`search?jql=Sprint = ${sprint} AND assignee in (${userId}) order by created DESC`);
    const { issues } = await fetch(url, {
        headers: getHeaders()
    }).then(toJson);

    return {
        sprint,
        issues
    };
}
