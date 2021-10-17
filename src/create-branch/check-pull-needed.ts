import {exec} from "./utils";
import ora from "ora";
import inquirer from "inquirer";
import {confirmed} from "../shared";

export async function checkPullNeeded() {
    const checkRemote = ora('Fetching remote').start();
    await exec(`git fetch`);
    const {stdout} = await exec(`git status -uno`);
    const updateNeeded = stdout.includes('Your branch is behind');

    if (!updateNeeded) {
        checkRemote.succeed('Branch up to date.');
        return;
    }

    const [, remoteBranchName] = /Your branch is behind '([\w\/]+)'/.exec(stdout)!;
    checkRemote.warn(`Your local branch is behind ${remoteBranchName}.`);
    const {pull} = await inquirer.prompt([{
        type: 'boolean',
        name: 'pull',
        message: `Update branch? (y/n)`,
        default: 'y'
    }]);

    if (confirmed(pull)) {
        checkRemote.start('Merging');
        await exec(`git merge ${remoteBranchName}`);
        checkRemote.succeed('Branch up to date.');
    }
}
