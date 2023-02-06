export async function getPageRawHTML(url: string): Promise<string> {
    const fetchResult = await fetch(url);
    return fetchResult.text();
}
