import inquirer from "inquirer";
import fetch from "node-fetch";
import {getHeaders, jiraApi, pluck, toJson} from "../create-branch/utils";
import fuzzy from "fuzzy";
import autocomplete from "inquirer-autocomplete-prompt";
import {JiraConfig} from "../types";

inquirer.registerPrompt('autocomplete', autocomplete);

function validate(value: string) {
    return value.trim().length > 0 || 'Please provide a value.';
}

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email) || 'Invalid email.';
}

export async function buildConfig(current?: JiraConfig) {
    const config = await inquirer.prompt([
        {
            name: 'email',
            message: 'Enter your Jira user email:',
            default: current?.email,
            validate: validateEmail
        },
        {
            name: 'token',
            message: 'Enter personal Jira token:',
            default: current?.token,
            validate
        },
        {
            name: 'userId',
            message: 'Enter Jira user ID:',
            default: current?.userId,
            validate
        },
        {
            name: 'apiPath',
            message: 'Enter api path:',
            default: current?.apiPath,
            validate
        },
        {
            name: 'todoStatuses',
            message: 'Enter your "TODO" issue status: (comma separated)',
            default: current?.todoStatuses?.replace(/"/g, '') ?? 'To Do',
            validate(value: string) {
                if (value.trim().length === 0) {
                    return 'Please provide a value.';
                }

                return /([\w\s]+,)*([\w\s]+)$/.test(value) || 'Please provide a comma separated list of statuses.';
            }
        },
    ]);

    const boards: {name: string, id: number}[] = [];
    let isLast = false;
    const boardUrl = jiraApi({
        apiPath: config.apiPath,
        path: 'board',
        type: 'agile'
    });

    do {
        const res = await fetch(`${boardUrl}?startAt=${boards.length}`, {
            headers: getHeaders(config)
        }).then(toJson);

        boards.push(...res.values);
        isLast = res.isLast;
    } while (!isLast);

    const choices = boards.map(({ name, id }) => {
        return {
            name: `${name} (${id})`,
            value: id,
            short: name
        };
    });

    const {boardId} = await inquirer.prompt([{
        type: 'autocomplete',
        message: 'Choose board:',
        name: 'boardId',
        loop: false,
        default: current?.boardId,
        source: function(_: any, searchTerm: string) {
            const filtered = searchTerm
                ? fuzzy.filter(searchTerm, choices, {extract: pluck('name')}).map(pluck('original'))
                : choices;

            return Promise.resolve(filtered);
        }
    }]);

    return {
        ...config,
        todoStatuses: config.todoStatuses.split(',').map((status: string) => `"${status.trim()}"`).join(','),
        boardId
    }
}
