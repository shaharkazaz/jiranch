import inquirer from 'inquirer';
import {getConfig, getHeaders, jiraApi, toJson} from "./utils";
import fetch from "node-fetch";
import {Sprint} from "../types";

async function getSprints(options?: { filter: string }) {
    let url = jiraApi({path: `board/${getConfig().boardId}/sprint`, type: 'agile'});
    if (options?.filter) {
        url += `?${options.filter}`;
    }

    return await fetch(url, {
        headers: getHeaders()
    }).then(toJson)
}

export async function getCurrentSprint(): Promise<Sprint> {
    return getSprints({filter: 'state=active'}).then(({values}) => {
        const {id, name} = values[0];

        return {id, name};
    });
}

export async function chooseSprint() {
    const choices = await getSprints().then((data) => {
        return data.values.slice(-3).map(({name, id}: {name: string, id: string}) => {
            return {
                name,
                value: {id, name}
            }
        })
    })

    return inquirer.prompt([{
        type: 'list',
        message: 'Choose sprint:',
        name: 'sprint',
        choices
    }
    ]);
}
