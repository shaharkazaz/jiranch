import {InlineConfig} from "../types";
import ora from "ora";
import {exec} from "./utils";

interface Options extends InlineConfig {
    branchName: string;
    prefix: string | null;
}

export async function createBranch({branchName, skipCheckout, prefix }: Options) {
    const creatingBranch = ora('Creating branch').start();

    const cmd = skipCheckout ? `git branch` : `git checkout -b`;
    const normalizedName = prefix ? `${prefix}-${branchName}` : branchName;
    await exec(`${cmd} ${normalizedName}`);

    creatingBranch.succeed(`Created branch: ${branchName}`);
    ora(`Checkout ${branchName}`).succeed();
}
