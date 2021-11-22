import inquirer from 'inquirer';

export function tagBranch() {
    const choices = ['None', 'Angels', 'Delta', 'Monitoring'].map(name => ({
      name: name,
      value: name === 'None' ? null : name.toLowerCase()
    }))

    return inquirer.prompt([{
        type: 'list',
        message: 'Tag branch with:',
        name: 'tag',
        choices
    }]);
}
