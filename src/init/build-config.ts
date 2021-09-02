import inquirer from "inquirer";

function validate(value: string) {
    return value.trim().length > 0 || 'Please provide a value.';
}

function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(email) || 'Invalid email.';
}

export function buildConfig() {
    return inquirer.prompt([
        {
            name: 'email',
            message: 'Enter your Jira user email:',
            validate: validateEmail
        },
        {
            name: 'token',
            message: 'Enter personal Jira token:',
            validate
        },
        {
            name: 'userId',
            message: 'Enter Jira user ID:',
            validate
        },
    ])
}
