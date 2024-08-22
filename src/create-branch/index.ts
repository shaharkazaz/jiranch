import {createBranch} from "./create-branch";
import {chooseIssue} from "./choose-issue";
import {fetchIssuesData} from "./fetch-issues-data";
import {fetchIssues} from "./fetch-issues";
import {chooseSprint, getCurrentSprint} from "./choose-sprint";
import {hasConfig, logAndExit} from "../shared";
import {InlineConfig} from "../types";
import {verifyBaseBranch} from "./verify-base-branch";
import {checkBranchExists} from "./check-branch-exists";
import {checkPullNeeded} from "./check-pull-needed";
import {getConfig} from "./utils";


export function createJiraBranch(inlineConfig: InlineConfig) {
    if (!hasConfig()) {
        console.log("Missing configuration! please run the 'init' command.");
        process.exit();
    }

    run(inlineConfig).catch(logAndExit);
}

async function run(inlineConfig: InlineConfig) {
    await verifyBaseBranch();
    let sprint;
    if (getConfig().boardType === 'scrum') {
        if (inlineConfig.selectSprint) {
            sprint = (await chooseSprint()).sprint;
        } else {
            sprint = await getCurrentSprint();

        }
    }

    const issues = await fetchIssues(inlineConfig, sprint);

    const issuesData = await fetchIssuesData(issues);

    const { branchName, issueId } = (await chooseIssue(issuesData)).selected;
    const options = {...inlineConfig, branchName, tag: null, issueId };

    await checkBranchExists(options);

    await checkPullNeeded();

    await createBranch(options);
}
