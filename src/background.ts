/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BackgroundRequest,
    GetLandingPageContentQuery,
    LANDING_PAGE_REQUEST,
    LandingPageQueryResult,
} from "lib/background-fetch";

async function getLandingPageContentHandler(
    request: GetLandingPageContentQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: LandingPageQueryResult) => void
) {
    const { url } = request;
    const fetchResult = await fetch(url);

    sendResponse({
        content: await fetchResult.text(),
    });
}

chrome.runtime.onMessage.addListener(
    <T>(
        req: BackgroundRequest<T>,
        sender: chrome.runtime.MessageSender,
        sendResponse: (a: any) => void
    ) => {
        if (req.query === LANDING_PAGE_REQUEST) {
            getLandingPageContentHandler(
                req.request as GetLandingPageContentQuery,
                sender,
                sendResponse
            );
            return true;
        }
        return false;
    }
);
