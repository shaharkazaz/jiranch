import {Options} from "../types";
import ora from "ora";
import {exec, tagBranch} from "./utils";

export async function createBranch({branchName, skipCheckout, tag }: Options) {
    const creatingBranch = ora('Creating branch').start();

    const cmd = skipCheckout ? `git branch` : `git checkout -b`;
    const normalizedName = tagBranch(branchName, tag);
    await exec(`${cmd} ${normalizedName}`);

    creatingBranch.succeed(`Created branch: ${normalizedName}`);
    ora(`Checkout ${normalizedName}`).succeed();
}
