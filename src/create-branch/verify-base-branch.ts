import {exec} from "./utils";
import inquirer from "inquirer";
import {confirmed} from "../shared";
import ora from "ora";

const mainBranches = ['master', 'main'];

export async function verifyBaseBranch() {
    const {stdout} = await exec('git branch --show-current');
    const isBaseBranch = mainBranches.some((branch) => stdout.includes(branch));

    if (!isBaseBranch) {
        ora().warn('You are not on main branch.');
        const {create} = await inquirer.prompt([{
            type: 'boolean',
            name: 'create',
            message: `Create branch from '${stdout.replace(/[\s\n]/g, '')}'? (y/n)`,
            default: 'n'
        }]);

        if (!confirmed(create)) {
            process.exit();
        }
    }
}
