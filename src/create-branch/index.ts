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
import {updateJiraStatus} from "./update-jira-status";
import {prefixBranch} from "./perfix-branch";

const loadingIssuesData = ora('Loading issues data...');

export function createJiraBranch(inlineConfig: InlineConfig) {
    if (!hasConfig()) {
        console.log("Missing configuration! please run the 'init' command.");
        process.exit();
    }

    run(inlineConfig).catch(logAndExit);
}

async function run(inlineConfig: InlineConfig) {
    let sprint = getCurrentSprint();
    if (inlineConfig.selectSprint && !inlineConfig.ninja) {
        sprint = (await chooseSprint()).sprint;
    }

    const issues = await fetchIssues(inlineConfig, sprint);

    loadingIssuesData.start();
    const issuesData = await fetchIssuesData(issues);
    loadingIssuesData.succeed('Issues data loaded.');

    const { branchName, issueId } = (await chooseIssue(issuesData)).selected;
    const options = {...inlineConfig, branchName, prefix: null };
    await checkBranchExists(options);
    await verifyBaseBranch();
    options.prefix = (await prefixBranch()).prefix;
    
    await createBranch(options);

    if (!inlineConfig.skipStatusUpdate) {
        await updateJiraStatus(issueId);
    }
}
