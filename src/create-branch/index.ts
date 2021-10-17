import {createBranch} from "./create-branch";
import {chooseIssue} from "./choose-issue";
import {fetchIssuesData} from "./fetch-issues-data";
import {fetchIssues} from "./fetch-issues";
import {chooseSprint, getCurrentSprint} from "./choose-sprint";
import {hasConfig, logAndExit} from "../shared";
import {InlineConfig} from "../types";
import {verifyBaseBranch} from "./verify-base-branch";
import {checkBranchExists} from "./check-branch-exists";
import {updateJiraStatus} from "./update-jira-status";
import {prefixBranch} from "./perfix-branch";
import {checkPullNeeded} from "./check-pull-needed";


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

    const issuesData = await fetchIssuesData(issues);

    const { branchName, issueId } = (await chooseIssue(issuesData)).selected;
    const options = {...inlineConfig, branchName, prefix: null };
    await checkBranchExists(options);
    await verifyBaseBranch();
    options.prefix = (await prefixBranch()).prefix;

    await checkPullNeeded();
    await createBranch(options);

    if (!inlineConfig.skipStatusUpdate) {
        await updateJiraStatus(issueId);
    }
}
