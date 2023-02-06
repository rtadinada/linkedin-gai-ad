/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BackgroundRequest,
    GetRawHTMLQuery,
    GetRawHTMLResult,
    RAW_HTML_REQUEST,
} from "lib/background-fetch";

async function getRawHTMLHandler(
    request: GetRawHTMLQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: GetRawHTMLResult) => void
) {
    const { url } = request;
    const fetchResult = await fetch(url);
    const content = await fetchResult.text();
    sendResponse({ html: content });
}

chrome.runtime.onMessage.addListener(
    <T>(
        req: BackgroundRequest<T>,
        sender: chrome.runtime.MessageSender,
        sendResponse: (a: any) => void
    ) => {
        if (req.query === RAW_HTML_REQUEST) {
            console.log(req);
            getRawHTMLHandler(req.request as GetRawHTMLQuery, sender, sendResponse);
            return true;
        }
        return false;
    }
);
