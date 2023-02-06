export type BackgroundRequest<T> = {
    query: string;
    request: T;
};
export type GetLandingPageContentQuery = {
    url: string;
};
export type LandingPageQueryResult = {
    content: string;
};

export const LANDING_PAGE_REQUEST = "LANDING_PAGE_REQUEST";

async function sendMessage<T, R>(message: BackgroundRequest<T>): Promise<R> {
    const result: R = await chrome.runtime.sendMessage(message);
    return result;
}

async function sendQuery<T, R>(query: string, request: T): Promise<R> {
    return sendMessage({ query, request });
}

async function sendGetLandingPageContentQuery(
    request: GetLandingPageContentQuery
): Promise<LandingPageQueryResult> {
    return sendQuery(LANDING_PAGE_REQUEST, request);
}

export async function getLandingPageContent(url: string): Promise<string> {
    const queryResult = await sendGetLandingPageContentQuery({ url });
    return queryResult.content;
}
