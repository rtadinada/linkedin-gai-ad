export function getResourceUrl(path: string): string {
    return window.chrome.runtime.getURL(path);
}
