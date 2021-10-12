import inquirer from 'inquirer';
import {sanitizeBranchName, pluck} from "./utils";
import autocomplete from 'inquirer-autocomplete-prompt';
import fuzzy from 'fuzzy';

inquirer.registerPrompt('autocomplete', autocomplete);

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
        type: 'autocomplete',
        message: 'Choose issue:',
        name: 'selected',
        loop: false,
        source: function(_: any, searchTerm: string) {
            const filtered = searchTerm
                ? fuzzy.filter(searchTerm, choices, {extract: pluck('name')}).map(pluck('original'))
                : choices;

            return Promise.resolve(filtered);
        }
    }]);
}
