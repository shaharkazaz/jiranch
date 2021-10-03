import fetch from 'node-fetch';
import {getConfig, getHeaders, jiraApi, toJson} from "./utils";
import {InlineConfig} from "../types";

export async function fetchIssues({allIssues}: InlineConfig, sprint: number) {
    const {userId} = getConfig();
    let jql = `search?jql=Sprint = ${sprint} AND assignee in (${userId})`;
    if (!allIssues) {
        // Filter done issues
        jql += ' AND status != Done';
    }
    jql += ' order by created DESC';
    const url = jiraApi(jql);
    const { issues } = await fetch(url, {
        headers: getHeaders()
    }).then(toJson);

    return {
        sprint,
        issues
    };
}
