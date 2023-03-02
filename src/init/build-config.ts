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
    ]);

    const { values: boards } = await fetch(jiraApi({
        apiPath: config.apiPath,
        path: 'board',
        type: 'agile'
    }), {
        headers: getHeaders(config)
    }).then(toJson);

    const choices = boards.map(({ name, id }: {name: string, id: number}) => {
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
        boardId
    }
}
