import Configstore from "configstore";

let store: Configstore;

export function getConfigStore() {
    if (!store) {
        store = new Configstore('jiranch');
    }

    return store;
}

export function confirmed(value: string) {
    return ['y', 'yes'].indexOf(value) > -1;
}

export function logAndExit(error: any) {
    console.log(error);
    process.exit();
}

export function hasConfig() {
    return Object.keys(getConfigStore().all).length
}
