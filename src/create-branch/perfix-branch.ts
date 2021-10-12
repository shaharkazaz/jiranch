import inquirer from 'inquirer';

export function prefixBranch() {
    const choices = ['None', 'Angels', 'Delta', 'Monitoring'].map(name => ({
      name: name,
      value: name === 'None' ? null : name.toLowerCase()
    }))

    return inquirer.prompt([{
        type: 'list',
        message: 'Prefix branch with:',
        name: 'prefix',
        choices
    }]);
}
