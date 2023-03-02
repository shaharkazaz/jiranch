import {exec} from "./utils";
import {Options} from "../types";
import ora from "ora";

export async function checkBranchExists({branchName, skipCheckout}: Options) {
    const {stdout} = await exec(`git branch --list '${branchName}*'`);
    const localBranchExists = !!stdout;

    if (localBranchExists) {
        ora(`Local branch exists! Skipping creation.`).succeed();
        const isActiveBranch = stdout.includes('*');

        if (isActiveBranch) {
            ora(`Already on ${branchName}`).succeed();
        } else if (!skipCheckout) {
            const localBranchName = stdout.trim();
            await exec(`git checkout ${localBranchName}`);
            ora(`Checkout ${localBranchName}`).succeed();
        }

        process.exit();
    }
}
