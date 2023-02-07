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

async function chatGPTQueryHandler(
    request: ChatGPTQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: ChatGPTResult) => void
) {
    const { input, numResponses } = request;
    const responses = [];
    for (let i = 0; i < numResponses; i++) {
        responses.push(`${input.trimStart().substring(0, 15)} ${i}`);
    }
    sendResponse({ responses });
}

async function dallEQueryHandler(
    request: DallEQuery,
    sender: chrome.runtime.MessageSender,
    sendResponse: (a: DallEResult) => void
) {
    const urls = [
        "https://www.springboard.com/blog/wp-content/uploads/2022/02/is-ai-hard-to-learn-scaled.jpg",
        "https://api.time.com/wp-content/uploads/2022/11/GettyImages-1358149692.jpg",
        "https://www.state.gov/wp-content/uploads/2021/06/AI-Motherboard-scaled.jpg",
        "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
        "https://www.simplilearn.com/ice9/free_resources_article_thumb/Types_of_Artificial_Intelligence.jpg",
    ];
    sendResponse({ urls });
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
        }
        return false;
    }
);
