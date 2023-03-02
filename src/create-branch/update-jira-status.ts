import fetch from "node-fetch";
import {getHeaders, jiraApi} from "./utils";
import ora from "ora";

const transitions = {IN_PROGRESS : 31};

function getTransitionData(id: number) {
    return JSON.stringify({transition: {id}});
}

export async function updateJiraStatus(issueId: string) {
    const loader = ora("Moving issue to 'In progress'");
    const url = jiraApi({path: `issue/${issueId}/transitions`});

    await fetch(url, {
        headers: getHeaders(),
        method: 'POST',
        body: getTransitionData(transitions.IN_PROGRESS)
    });

    loader.succeed(`Moved issue '${issueId}' to 'In progress'.`);
}
