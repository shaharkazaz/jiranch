import inquirer from 'inquirer';
import {sanitizeBranchName} from "./utils";

export function chooseIssue(issuesData: any[]) {
    const choices = issuesData.map(({ key, fields }) => {
        const branchName = `${key}-${sanitizeBranchName(fields.summary)}`;

        return {
            name: `${key}: ${fields.summary}`,
            value: {branchName, issueId: key},
            short: key
        };
    });

    return inquirer.prompt([{
        type: 'list',
        message: 'Choose issue:',
        name: 'selected',
        choices
    }]);
}
