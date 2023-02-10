export function range(end: number): number[] {
    return Array.from({ length: end }, (_, i) => i);
}

export function removeTabNewline(s: string): string {
    return s.replace(/[\n\t\xa0]/g, "");
}

export function collapseWhitespace(str: string): string {
    return str.replace(/\s{2,}/g, " ");
}

export function removeDoubleQuotes(s: string) {
    return s.replace(/\"/g, "");
}

export function parseHeadersArray(headersArr: chrome.webRequest.HttpHeader[]): object {
    const headers: Record<string, string> = {};
    for (const header of headersArr) {
        headers[header.name] = header.value || "";
    }
    return headers;
}
