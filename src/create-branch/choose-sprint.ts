import inquirer from 'inquirer';
import {sprintDisplayName} from "./utils";

const baseSprint = 124;
const currentSprint = baseSprint + Math.floor((Date.now() - new Date('08/22/2021').getTime()) / 604800000);

export function getCurrentSprint() {
    return currentSprint;
}

export function chooseSprint() {
    return inquirer.prompt([{
        type: 'list',
        message: 'Choose sprint:',
        name: 'sprint',
        choices: Array.from(Array(3), (_, i) => {
                const sprint = currentSprint + i;

                return {
                    name: `${sprintDisplayName(sprint)}${i === 0 ? ` (Current)` : ''}`,
                    value: sprint
                };
            }
        )
    }
    ]);
}
