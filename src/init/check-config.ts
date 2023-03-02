import {confirmed, hasConfig} from "../shared";
import inquirer from "inquirer";
import {getConfig} from "../create-branch/utils";

export async function checkConfig() {
    if (!hasConfig()) {
        return Promise.resolve();
    }

    console.log('Found the following config:');
    Object.entries(getConfig()).forEach(([key, value]) => console.log(`${key}: ${value}`));

    return inquirer.prompt([
        {
            type: 'boolean',
            name: 'overrideConfig',
            message: 'Override current config? (y/n)',
            default: 'y'
        }
    ]).then(({overrideConfig}) => {
        if (!confirmed(overrideConfig)) {
            process.exit();
        }
    });
}
