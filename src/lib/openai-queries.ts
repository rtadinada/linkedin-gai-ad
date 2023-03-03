import * as Settings from "lib/settings";

import { makeChatGPTQuery, makeDallEQuery } from "./background-fetch";
import { MAX_HEADLINE_LENGTH, MAX_INTRO_TEXT_LENGTH, MAX_OVERLAY_TEXT_LENGTH } from "./limits";
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

async function makeHeadlinePrompt() {
    return `${createCharacterPrompt(
        MAX_HEADLINE_LENGTH
    )}, ${await Settings.getHeadlinePrompt()} the product described above:`;
}

async function makeIntroTextPrompt() {
    return `${createCharacterPrompt(
        MAX_INTRO_TEXT_LENGTH
    )}, ${await Settings.getIntroTextPrompt()} the product described above:`;
}

async function makeOverlayTextPrompt() {
    return `${createCharacterPrompt(
        MAX_OVERLAY_TEXT_LENGTH
    )}, ${await Settings.getOverlayTextPrompt()} the product described above:`;
}

async function makeImagePromptPrompt() {
    return `${await Settings.getImagePromptPrompt()} with product described above:`;
}

function getRandomString(strings: string[]): string {
    const randomIndex = Math.floor(Math.random() * strings.length);
    return strings[randomIndex];
}

async function getRandomStyle() {
    return getRandomString(await Settings.getImageStyles());
}

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
    overlayTexts: string[];
    imageUrls: string[];
};

export async function generateCampaignName(content: string): Promise<string | null> {
    console.log({ content });
    const prompt = makePrompt(content, await Settings.getCampaignNamePrompt());
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
    const prompt = makePrompt(content, await makeHeadlinePrompt());

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
    const prompt = makePrompt(content, await makeIntroTextPrompt());

    const responses = await makeChatGPTQuery(
        prompt,
        getNumTokens(MAX_INTRO_TEXT_LENGTH),
        NUM_OPTIONS
    );
    return (
        responses?.map(removeTabNewline).map((r) => r.substring(0, MAX_INTRO_TEXT_LENGTH)) || null
    );
}

export async function generateOverlayText(content: string): Promise<string[] | null> {
    const prompt = makePrompt(content, await makeOverlayTextPrompt());

    const responses = await makeChatGPTQuery(
        prompt,
        getNumTokens(MAX_OVERLAY_TEXT_LENGTH),
        NUM_OPTIONS - 1
    );
    const filteredResponses =
        responses
            ?.map(removeTabNewline)
            .map((s) => s.replace(/\"/g, ""))
            .map((r) => r.substring(0, MAX_OVERLAY_TEXT_LENGTH)) || [];
    return responses !== null ? ["", ...filteredResponses] : null;
}

async function generateImagePrompt(content: string): Promise<string | null> {
    const prePrompt = makePrompt(content, await makeImagePromptPrompt());
    const results = await makeChatGPTQuery(prePrompt, 500, 1);
    if (results === null) {
        return null;
    }

    let result = removeDoubleQuotes(removeTabNewline(results[0]));
    if (result.endsWith(".")) {
        result = result.substring(0, result.length - 1);
    }

    return `${result}, ${await getRandomStyle()}.`;
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
    const [campaignName, headlines, introTexts, overlayTexts, imageUrls] = await Promise.all([
        generateCampaignName(content),
        generateHeadlines(content),
        generateIntroText(content),
        generateOverlayText(content),
        generateImages(content),
    ]);
    if (
        campaignName === null ||
        headlines === null ||
        introTexts === null ||
        overlayTexts === null ||
        imageUrls === null
    ) {
        return null;
    }

    return {
        campaignName,
        headlines,
        introTexts,
        overlayTexts,
        imageUrls,
    };
}
