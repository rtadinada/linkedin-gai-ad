import { makeChatGPTQuery, makeDallEQuery } from "./background-fetch";
import { MAX_HEADLINE_LENGTH, MAX_INTRO_TEXT_LENGTH } from "./limits";
import { removeDoubleQuotes, removeTabNewline } from "./util";

const NUM_OPTIONS = 5;

function createCharacterPrompt(numCharacters: number): string {
    return `In ${
        Math.floor((0.5 * numCharacters) / 10) * 10
    } characters or less, being brief and to the point`;
}

function getNumTokens(numCharacters: number): number {
    return Math.floor(numCharacters / 3.5);
}

const CAMPAIGN_NAME_PROMPT =
    "Being very brief (in 4 words or less), come up with a name for an ad campaign for the product described above:";
const HEADLINE_PROMPT = `${createCharacterPrompt(
    MAX_HEADLINE_LENGTH
)}, write a compelling headline to sell the product described above:`;
const INTRO_TEXT_PROMPT = `${createCharacterPrompt(
    MAX_INTRO_TEXT_LENGTH
)}, write a compelling ad copy to sell the product described above:`;

function getRandomString(strings: string[]): string {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}

// const IMAGE_ENVIRONMENTS = [
//     "in an artistic building",
//     "on the top floor of a skyscraper",
//     "in a city street",
//     "in the middle of a bustling office",
// ];
// function makeImagePromptPrompt(environment: string) {
//     return (
//         "In 15 words or less, describe instructions you would give to a graphic " +
//         "designer to make an ad that showcases a major selling point of the product above. " +
//         "Use the category of the product instead of any specific product name, and consider having a person use and enjoy the " +
//         `product ${environment}:`
//     );
// }
const IMAGE_PROMPT_PROMPT =
    "In 15 words or less, without using the names of any products, describe a scene in a artistic building that includes a view of nature with someone happily making something with product described above:";

const IMAGE_STYLES = [
    "in the style of an Isometric Illustration",
    "in a minamalist flat design",
    "as a pencil drawing",
];

function truncate(input: string): string {
    return input.substring(0, 15000) + ".";
}

function makePrompt(content: string, prompt: string) {
    const truncatedContent = truncate(content);
    return `${truncatedContent}\n${prompt}\n`;
}

export type GeneratedOptions = {
    campaignName: string;
    headlines: string[];
    introTexts: string[];
    imageUrls: string[];
};

export async function generateCampaignName(content: string): Promise<string | null> {
    console.log({ content });
    const prompt = makePrompt(content, CAMPAIGN_NAME_PROMPT);
    const results = await makeChatGPTQuery(prompt, 15, 1);
    if (results === null) {
        return null;
    }

    let result = removeDoubleQuotes(removeTabNewline(results[0]));
    if (result.endsWith(".")) {
        result = result.substring(0, result.length - 1);
    }

    return result;
}

export async function generateHeadlines(content: string): Promise<string[] | null> {
    const prompt = makePrompt(content, HEADLINE_PROMPT);

    const responses = await makeChatGPTQuery(
        prompt,
        getNumTokens(MAX_HEADLINE_LENGTH),
        NUM_OPTIONS
    );
    return (
        responses
            ?.map(removeTabNewline)
            .map(removeDoubleQuotes)
            .map((r) => r.substring(0, MAX_HEADLINE_LENGTH)) || null
    );
}

export async function generateIntroText(content: string): Promise<string[] | null> {
    const prompt = makePrompt(content, INTRO_TEXT_PROMPT);

    const responses = await makeChatGPTQuery(
        prompt,
        getNumTokens(MAX_INTRO_TEXT_LENGTH),
        NUM_OPTIONS
    );
    return (
        responses?.map(removeTabNewline).map((r) => r.substring(0, MAX_INTRO_TEXT_LENGTH)) || null
    );
}

async function generateImagePrompt(content: string): Promise<string | null> {
    const prePrompt = makePrompt(content, IMAGE_PROMPT_PROMPT);
    const results = await makeChatGPTQuery(prePrompt, 500, 1);
    if (results === null) {
        return null;
    }

    let result = removeDoubleQuotes(removeTabNewline(results[0]));
    if (result.endsWith(".")) {
        result = result.substring(0, result.length - 1);
    }

    return `${result}, ${getRandomString(IMAGE_STYLES)}.`;
}

export async function generateImages(content: string): Promise<string[] | null> {
    const imagePrompt = await generateImagePrompt(content);
    console.log(imagePrompt);
    if (imagePrompt === null) {
        return null;
    }

    return makeDallEQuery(imagePrompt, NUM_OPTIONS);
}

export async function generateAllOptions(content: string): Promise<GeneratedOptions | null> {
    const [campaignName, headlines, introTexts, imageUrls] = await Promise.all([
        generateCampaignName(content),
        generateHeadlines(content),
        generateIntroText(content),
        generateImages(content),
    ]);
    if (campaignName === null || headlines === null || introTexts === null || imageUrls === null) {
        return null;
    }

    return {
        campaignName,
        headlines,
        introTexts,
        imageUrls,
    };
}
