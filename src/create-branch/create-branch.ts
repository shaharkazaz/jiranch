import {InlineConfig} from "../types";
import ora from "ora";
import {exec} from "./utils";

interface Options extends InlineConfig {
    branchName: string;
    tag: string | null;
}

export async function createBranch({branchName, skipCheckout, tag }: Options) {
    const creatingBranch = ora('Creating branch').start();

    const cmd = skipCheckout ? `git branch` : `git checkout -b`;
    const normalizedName = tag ? branchName.replace(/(RD-\d+)/, `$1-${tag}`) : branchName;
    await exec(`${cmd} ${normalizedName}`);

    creatingBranch.succeed(`Created branch: ${branchName}`);
    ora(`Checkout ${branchName}`).succeed();
}
