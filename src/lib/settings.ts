const CAMPAIGN_GROUP_OPTION = "CAMPAIGN_GROUP_OPTION";
const CAMPAIGN_GROUP_DEFAULT = -1;

const OPEN_AI_KEY_OPTION = "OPEN_AI_KEY_OPTION";
const OPEN_AI_KEY_DEFAULT = "";

const CAMPAIGN_NAME_PROMPT_OPTION = "CAMPAIGN_NAME_PROMPT_OPTION";
const CAMPAIGN_NAME_PROMPT_DEFAULT =
    "Being very brief (in 4 words or less), come up with a name for an ad campaign for the product described above:";

const HEADLINE_PROMPT_OPTION = "HEADLINE_PROMPT_OPTION";
const HEADLINE_PROMPT_DEFAULT = "write a compelling headline to sell";

const INTRO_TEXT_PROMPT_OPTION = "INTRO_TEXT_PROMPT_OPTION";
const INTRO_TEXT_PROMPT_DEFAULT = "write compelling ad copy to sell";

const IMAGE_PROMPT_PROMPT_OPTION = "IMAGE_PROMPT_PROMPT_OPTION";
const IMAGE_PROMPT_PROMPT_DEFAULT =
    "In 15 words or less, without using the names of any products, describe a scene in a artistic building that includes a view of nature with someone happily making something";

const IMAGE_STYLES_OPTION = "IMAGE_STYLES_OPTION";
const IMAGE_STYLES_DEFAULT = [
    "in the style of an Isometric Illustration",
    "in a minamalist flat design",
    "as a line drawing",
];

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
            const result = items[name] as T;
            return resolve(result === "" ? defaultValue : result);
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

export async function getCampaignNamePrompt(): Promise<string> {
    return getOption(CAMPAIGN_NAME_PROMPT_OPTION, CAMPAIGN_NAME_PROMPT_DEFAULT);
}

export async function setCampaignNamePrompt(value: string): Promise<boolean> {
    return await saveOption(CAMPAIGN_NAME_PROMPT_OPTION, value);
}

export async function getHeadlinePrompt(): Promise<string> {
    return getOption(HEADLINE_PROMPT_OPTION, HEADLINE_PROMPT_DEFAULT);
}

export async function setHeadlinePrompt(value: string): Promise<boolean> {
    return await saveOption(HEADLINE_PROMPT_OPTION, value);
}

export async function getIntroTextPrompt(): Promise<string> {
    return getOption(INTRO_TEXT_PROMPT_OPTION, INTRO_TEXT_PROMPT_DEFAULT);
}

export async function setIntroTextPrompt(value: string): Promise<boolean> {
    return await saveOption(INTRO_TEXT_PROMPT_OPTION, value);
}

export async function getImagePromptPrompt(): Promise<string> {
    return getOption(IMAGE_PROMPT_PROMPT_OPTION, IMAGE_PROMPT_PROMPT_DEFAULT);
}

export async function setImagePromptPrompt(value: string): Promise<boolean> {
    return await saveOption(IMAGE_PROMPT_PROMPT_OPTION, value);
}

export async function getImageStyles(): Promise<string[]> {
    return getOption(IMAGE_STYLES_OPTION, IMAGE_STYLES_DEFAULT);
}

export async function setImageStyles(value: string[]): Promise<boolean> {
    return await saveOption(IMAGE_STYLES_OPTION, value);
}
