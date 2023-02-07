import { makeChatGPTQuery, makeDallEQuery } from "./background-fetch";

const NUM_OPTIONS = 5;

const HEADLINE_PROMPT =
    "In 10 words or less, write a compelling headline to sell the product described above:";
const INTRO_TEXT_PROMPT =
    "In 100 words or less, write a compelling ad copy to sell the product described above:";
const IMAGE_PROMPT_PROMPT =
    "In 15 words or less, without using the names of any products, describe a scene with environment of someone using the product described above:";

function truncate(input: string): string {
    return input.substring(0, 15000) + ".";
}

function makePrompt(content: string, prompt: string) {
    const truncatedContent = truncate(content);
    return `${truncatedContent}\n${prompt}\n`;
}

function sanitizeOutput(s: string): string {
    return s.replace(/[\n\t]/g, "");
}

export type GeneratedOptions = {
    headlines: string[];
    introTexts: string[];
    imageUrls: string[];
};

export async function generateHeadlines(content: string): Promise<string[] | null> {
    const prompt = makePrompt(content, HEADLINE_PROMPT);

    const responses = await makeChatGPTQuery(prompt, 8, NUM_OPTIONS);
    return responses?.map(sanitizeOutput) || null;
}

export async function generateIntroText(content: string): Promise<string[] | null> {
    const prompt = makePrompt(content, INTRO_TEXT_PROMPT);

    const responses = await makeChatGPTQuery(prompt, 500, NUM_OPTIONS);
    return responses?.map(sanitizeOutput) || null;
}

async function generateImagePrompt(content: string): Promise<string | null> {
    const prePrompt = makePrompt(content, IMAGE_PROMPT_PROMPT);
    const results = await makeChatGPTQuery(prePrompt, 500, 1);
    if (results === null) {
        return null;
    }

    let result = results[0];
    if (result.endsWith(".")) {
        result = result.substring(0, result.length - 1);
    }

    return `${result}, in the style of a WPA National Park poster.`;
}

export async function generateImages(content: string): Promise<string[] | null> {
    const imagePrompt = await generateImagePrompt(content);
    if (imagePrompt === null) {
        return null;
    }

    return makeDallEQuery(imagePrompt, NUM_OPTIONS);
}

export async function generateAllOptions(content: string): Promise<GeneratedOptions | null> {
    const [headlines, introTexts, imageUrls] = await Promise.all([
        generateHeadlines(content),
        generateIntroText(content),
        generateImages(content),
    ]);
    if (headlines === null || introTexts === null || imageUrls === null) {
        return null;
    }

    return {
        headlines,
        introTexts,
        imageUrls,
    };
}
