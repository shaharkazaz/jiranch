import fetch from 'node-fetch';
import {getHeaders, sprintDisplayName, toJson} from "./utils";

interface Options {
    issues: any[];
    sprint: number
}

export function fetchIssuesData({ issues, sprint }: Options) {
    if (!issues || !issues.length) {
        console.log(`There are no issues assigned to the provided user on sprint ${sprintDisplayName(sprint)}`);
        process.exit();
    }

    const issuesData = issues.map(({ key }) => fetch(`https://lumigo.atlassian.net/rest/api/2/issue/${key}`, { headers: getHeaders() }));

    return Promise.all(issuesData).then(responses => Promise.all(responses.map(toJson)));
}
