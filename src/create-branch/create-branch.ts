import {Options} from "../types";
import ora from "ora";
import {exec} from "./utils";

export async function createBranch({branchName, skipCheckout}: Options) {
    const creatingBranch = ora('Creating branch').start();

    const cmd = skipCheckout ? `git branch` : `git checkout -b`;
    await exec(`${cmd} ${branchName}`);

    creatingBranch.succeed(`Created branch: ${branchName}`);
    ora(`Checkout ${branchName}`).succeed();
}
