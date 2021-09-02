import {confirmed, getConfigStore, logAndExit} from "../shared";
import inquirer from "inquirer";

export function clearConfig() {
    run().catch(logAndExit);
}

async function run() {
    const {deleteConfig} = await inquirer.prompt([{
        type: 'boolean',
        name: 'deleteConfig',
        message: 'You are about to delete your configuration, are you sure? (y/n)',
        default: 'y'
    }]);

    if(confirmed(deleteConfig)) {
        getConfigStore().clear();
    }
}
