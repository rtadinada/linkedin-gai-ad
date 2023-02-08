const CAMPAIGN_GROUP_OPTION = "CAMPAIGN_GROUP_OPTION";
const CAMPAIGN_GROUP_DEFAULT = -1;

const OPEN_AI_KEY_OPTION = "OPEN_AI_KEY_OPTION";
const OPEN_AI_KEY_DEFAULT = "";

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
    return getOption(CAMPAIGN_GROUP_OPTION, CAMPAIGN_GROUP_DEFAULT);
}

export async function setCampaignGroup(id: number): Promise<boolean> {
    return await saveOption(CAMPAIGN_GROUP_OPTION, id);
}

export async function getOpenAiKey(): Promise<string> {
    return getOption(OPEN_AI_KEY_OPTION, OPEN_AI_KEY_DEFAULT);
}

export async function setOpenAiKey(key: string): Promise<boolean> {
    return await saveOption(OPEN_AI_KEY_OPTION, key);
}
