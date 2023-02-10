import * as Settings from "lib/settings";

import { fetchWithRetry } from "./fetch";

async function createPostHeaders() {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await Settings.getOpenAiKey()}`,
    };
}

const COMPLETETION_ENDPOINT = "https://api.openai.com/v1/completions";
const IMAGE_ENDPOINT = "https://api.openai.com/v1/images/generations";

const COMPLETION_CONFIG = {
    model: "text-davinci-003",
    temperature: 0.9,
};

const IMAGE_CONFIG = {};

interface CompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
        text: string;
        index: number;
        logprobs: number | null;
        finish_reason: string;
    }[];
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface ImageResponse {
    created: number;
    data: {
        url: string;
    }[];
}

async function throwBadResponseCode(
    requestBody: object,
    requestOptions: object,
    response: Response
) {
    const responseText = await response.text();
    const responseJson = JSON.stringify(responseText);
    console.error({
        requestBody,
        requestOptions,
        responseText,
        responseJson,
    });
    throw new Error(`Error in result, status ${response.status}: ${responseText}`);
}

async function makeCompletionQuery(
    prompt: string,
    maxTokens: number,
    numResponses: number
): Promise<CompletionResponse> {
    const requestBody = {
        ...COMPLETION_CONFIG,
        prompt,
        max_tokens: maxTokens,
        n: numResponses,
    };
    const requestOptions = {
        method: "POST",
        headers: await createPostHeaders(),
        body: JSON.stringify(requestBody),
    };

    const response = await fetchWithRetry(COMPLETETION_ENDPOINT, requestOptions);
    if (response.status !== 200) {
        await throwBadResponseCode(requestBody, requestOptions, response);
    }
    return (await response.json()) as CompletionResponse;
}

async function makeImageQuery(prompt: string, numResponses: number): Promise<ImageResponse> {
    const requestBody = {
        ...IMAGE_CONFIG,
        prompt,
        n: numResponses,
    };
    const requestOptions = {
        method: "POST",
        headers: await createPostHeaders(),
        body: JSON.stringify(requestBody),
    };

    const response = await fetchWithRetry(IMAGE_ENDPOINT, requestOptions);
    if (response.status !== 200) {
        await throwBadResponseCode(requestBody, requestOptions, response);
    }
    return (await response.json()) as ImageResponse;
}

export async function getCompletions(
    prompt: string,
    maxTokens: number,
    numResponses: number
): Promise<string[] | null> {
    const completionParameters = { prompt, maxTokens, numResponses };

    let result = null;
    try {
        result = await makeCompletionQuery(prompt, maxTokens, numResponses);
        console.log({ completionParameters, result });
        return result.choices.map((c) => c.text);
    } catch (e) {
        console.error("getCompletions error");
        console.error({ e, completionParameters, result });
        console.error(e);

        return null;
    }
}

export async function getImages(prompt: string, numResponses: number): Promise<string[] | null> {
    const completionParameters = { prompt, numResponses };

    let result = null;
    try {
        result = await makeImageQuery(prompt, numResponses);
        console.log({ completionParameters, result });
        return result.data.map((d) => d.url);
    } catch (e) {
        console.error("getImages error");
        console.error({ e, completionParameters, result });
        console.error(e);

        return null;
    }
}
