import fetch from 'node-fetch';
import {getHeaders, jiraApi, toJson} from "./utils";
import ora from "ora";
import {Sprint} from "../types";

interface Options {
    issues: any[];
    sprint: Sprint
}

export async function fetchIssuesData({ issues, sprint }: Options) {
    if (!issues || !issues.length) {
        console.log(`There are no issues assigned to the provided user on sprint ${sprint.name}`);
        process.exit();
    }
    const fetching = ora('Loading issues data...').start();

    const issuesData = issues.map(({ key }) => fetch(jiraApi({path: `issue/${key}`}), { headers: getHeaders() }));

    const responses = await Promise.all(issuesData);
    const result = await Promise.all(responses.map(toJson));
    fetching.succeed('Issues data loaded.');

    return result;
}
