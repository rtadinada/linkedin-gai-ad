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

export const RAW_HTML_REQUEST = "RAW_HTML_REQUEST";

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

export async function getRawHTML(url: string): Promise<string | null> {
    const queryResult = await sendGetRawHTMLQuery({ url });
    const { html } = queryResult;
    return html;
}
