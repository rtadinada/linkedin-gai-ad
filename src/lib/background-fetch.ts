export type BackgroundRequest<T> = {
    query: string;
    request: T;
};

export type GetRawHTMLQuery = {
    url: string;
};
export type GetRawHTMLResult = {
    html: string | null;
};

export type ChatGPTQuery = {
    input: string;
    maxTokens: number;
    numResponses: number;
};
export type ChatGPTResult = {
    responses: string[] | null;
};

export type DallEQuery = {
    input: string;
    numResponses: number;
};
export type DallEResult = {
    urls: string[] | null;
};

export const RAW_HTML_REQUEST = "RAW_HTML_REQUEST";
export const CHAT_GPT_REQUEST = "CHAT_GPT_REQUEST";
export const DALL_E_REQUEST = "DALL_E_REQUEST";

async function sendMessage<T, R>(message: BackgroundRequest<T>): Promise<R> {
    const result: R = await chrome.runtime.sendMessage(message);
    return result;
}

async function sendQuery<T, R>(query: string, request: T): Promise<R> {
    return sendMessage({ query, request });
}

async function sendGetRawHTMLQuery(request: GetRawHTMLQuery): Promise<GetRawHTMLResult> {
    return sendQuery(RAW_HTML_REQUEST, request);
}

async function sendChatGPTQuery(request: ChatGPTQuery): Promise<ChatGPTResult> {
    return sendQuery(CHAT_GPT_REQUEST, request);
}

async function sendDallEQuery(request: DallEQuery): Promise<DallEResult> {
    return sendQuery(DALL_E_REQUEST, request);
}

export async function getRawHTML(url: string): Promise<string | null> {
    const queryResult = await sendGetRawHTMLQuery({ url });
    const { html } = queryResult;
    return html;
}

export async function makeChatGPTQuery(
    input: string,
    maxTokens: number,
    numResponses = 1
): Promise<string[] | null> {
    const queryResult = await sendChatGPTQuery({ input, maxTokens, numResponses });
    const { responses } = queryResult;
    return responses;
}

export async function makeDallEQuery(input: string, numResponses = 1): Promise<string[] | null> {
    const queryResult = await sendDallEQuery({ input, numResponses });
    const { urls } = queryResult;
    return urls;
}
