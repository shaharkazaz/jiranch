import {exec} from "./utils";
import {InlineConfig} from "../types";
import ora from "ora";

interface Options extends InlineConfig {
    branchName: string;
}

export async function checkBranchExists({branchName, skipCheckout}: Options) {
    const {stdout} = await exec(`git branch --list ${branchName}`);
    const localBranchExists = !!stdout;

    if (localBranchExists) {
        ora(`Local branch exists! Skipping creation.`).succeed();

        if (!skipCheckout) {
            await exec(`git checkout ${branchName}`);
            ora(`Checkout ${branchName}`).succeed();
        }
        process.exit();
    }
}
