/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    BackgroundRequest,
    CHAT_GPT_REQUEST,
    ChatGPTQuery,
    ChatGPTResult,
    DALL_E_REQUEST,
    DallEQuery,
    DallEResult,
    GetRawHTMLQuery,
    GetRawHTMLResult,
    IMAGE_DOWNLOAD_REQUEST,
    ImageDownloadQuery,
    ImageDownloadResult,
    POST_HEADERS_REQUEST,
    PostHeadersQuery,
    PostHeadersResult,
    RAW_HTML_REQUEST,
} from "lib/background-fetch";
import { getCompletions, getImages } from "lib/openapi-fetch";
import { serializeBlob } from "lib/serede";
import { parseHeadersArray } from "lib/util";

let postHeaders: object | null = null;
chrome.webRequest.onSendHeaders.addListener(
    (details) => {
        if (details.method === "POST") {
            const newHeaders = details.requestHeaders;
            if (!newHeaders) {
                return;
            }

            const contentTypeHeader = newHeaders.find((h) => h.name.includes("Content-Type"));

            if (postHeaders === null || contentTypeHeader?.value?.includes("json")) {
                postHeaders = parseHeadersArray(newHeaders);
            }
        }
    },
    { urls: ["https://www.linkedin.com/campaign-manager-api/*"] },
    ["requestHeaders"]
);

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

async function chatGPTQueryHandler(
    request: ChatGPTQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: ChatGPTResult) => void
) {
    const { input, maxTokens, numResponses } = request;
    const responses = await getCompletions(input, maxTokens, numResponses);
    sendResponse({ responses });
    // sendResponse({ responses: ["a", "b", "c", "d", "e"] });
}

async function dallEQueryHandler(
    request: DallEQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: DallEResult) => void
) {
    const { input, numResponses } = request;
    const urls = await getImages(input, numResponses);
    sendResponse({ urls });
    // const urls = [
    //     "https://www.state.gov/wp-content/uploads/2021/06/AI-Motherboard-scaled.jpg",
    //     "https://api.time.com/wp-content/uploads/2022/11/GettyImages-1358149692.jpg",
    //     "https://www.state.gov/wp-content/uploads/2021/06/AI-Motherboard-scaled.jpg",
    //     "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
    //     "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
    // ];
    // sendResponse({ urls });
}

async function postHeadersQueryHandler(
    request: PostHeadersQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: PostHeadersResult) => void
) {
    sendResponse({ postHeaders });
}

async function imageDownloadQueryHandler(
    request: ImageDownloadQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: ImageDownloadResult) => void
) {
    const response = await fetch(request.url);
    const blob = await response.blob();
    console.log({ response, blob });
    sendResponse({ blob: await serializeBlob(blob) });
}

chrome.runtime.onMessage.addListener(
    <T>(
        req: BackgroundRequest<T>,
        sender: chrome.runtime.MessageSender,
        sendResponse: (a: any) => void
    ) => {
        console.log(req);
        if (req.query === RAW_HTML_REQUEST) {
            getRawHTMLHandler(req.request as GetRawHTMLQuery, sender, sendResponse);
            return true;
        } else if (req.query === CHAT_GPT_REQUEST) {
            chatGPTQueryHandler(req.request as ChatGPTQuery, sender, sendResponse);
            return true;
        } else if (req.query === DALL_E_REQUEST) {
            dallEQueryHandler(req.request as DallEQuery, sender, sendResponse);
            return true;
        } else if (req.query === POST_HEADERS_REQUEST) {
            postHeadersQueryHandler(req.request as PostHeadersQuery, sender, sendResponse);
            return true;
        } else if (req.query === IMAGE_DOWNLOAD_REQUEST) {
            imageDownloadQueryHandler(req.request as ImageDownloadQuery, sender, sendResponse);
            return true;
        }
        return false;
    }
);
