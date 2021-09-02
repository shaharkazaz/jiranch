import {sprintDisplayName} from "./utils";
import {createBranch} from "./create-branch";
import {chooseIssue} from "./choose-issue";
import {fetchIssuesData} from "./fetch-issues-data";
import {fetchIssues} from "./fetch-issues";
import {chooseSprint, getCurrentSprint} from "./choose-sprint";
import ora from "ora";
import {hasConfig, logAndExit} from "../shared";
import {InlineConfig} from "../types";
import {verifyBaseBranch} from "./verify-base-branch";
import {checkBranchExists} from "./check-branch-exists";

const loadingIssuesData = ora('Loading issues data...');
const loadingIssues = ora('Loading sprint issues...');

export function createJiraBranch(inlineConfig: InlineConfig) {
    if (!hasConfig()) {
        console.log("Missing configuration! please run the 'init' command.");
        process.exit();
    }

    run(inlineConfig).catch(logAndExit);
}

async function run(inlineConfig: InlineConfig) {
    let sprint = getCurrentSprint();
    if (inlineConfig.selectSprint) {
        sprint = (await chooseSprint()).sprint;
    }

    loadingIssues.start();
    const issues = await fetchIssues(sprint)
    loadingIssues.succeed(`Sprint ${sprintDisplayName(sprint)} issues loaded.`);

    loadingIssuesData.start();
    const issuesData = await fetchIssuesData(issues);
    loadingIssuesData.succeed('Issues data loaded.');

    const { branchName } = await chooseIssue(issuesData);
    const options = {...inlineConfig, branchName};
    await checkBranchExists(options);
    await verifyBaseBranch();
    await createBranch(options);
}
