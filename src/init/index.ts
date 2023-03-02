import {checkConfig} from "./check-config";
import {buildConfig} from "./build-config";
import {getConfigStore, logAndExit} from "../shared";
import {getConfig} from "../create-branch/utils";

export function init() {
    run().catch(logAndExit);
}

async function run() {
    await checkConfig();

    console.log('See README for more information about the config.');
    getConfigStore().all = await buildConfig(getConfig());
    console.log('Config created successfully!');
}
