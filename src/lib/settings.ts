const CAMPAIGN_GROUP_OPTION = "CAMPAIGN_GROUP_OPTION";
const CAMPAIGN_GROUP_DEFAULT = -1;

async function saveOption<T>(name: string, value: T): Promise<boolean> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.set({ [name]: value }, () => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            return resolve(true);
        });
    });
}

async function getOption<T>(name: string, defaultValue: T): Promise<T> {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get({ [name]: defaultValue }, (items) => {
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            return resolve(items[name] as T);
        });
    });
}

export async function getCampaignGroup(): Promise<number> {
    const res = await getOption(CAMPAIGN_GROUP_OPTION, CAMPAIGN_GROUP_DEFAULT);
    console.log({ res });
    return res;
}

export async function setCampaignGroup(id: number): Promise<boolean> {
    const success = await saveOption(CAMPAIGN_GROUP_OPTION, id);
    console.log({ success });
    return success;
}
