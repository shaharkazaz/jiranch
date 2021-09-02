import fetch from 'node-fetch';
import {getConfig, getHeaders, toJson} from "./utils";

export function fetchIssues(sprint: number) {
    const {userId} = getConfig();

    return fetch(`https://lumigo.atlassian.net/rest/api/2/search?jql=Sprint = ${sprint} AND assignee in (${userId}) order by created DESC`, {
        headers: getHeaders()
    }).then(toJson)
        .then(({ issues }) => {
            return {
                sprint,
                issues
            };
        });
}
