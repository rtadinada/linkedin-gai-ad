import { Readability } from "@mozilla/readability";

import { getRawHTML } from "./background-fetch";
import { removeTabNewline } from "./util";

export async function getLandingPageText(url: string): Promise<string | null> {
    const html = await getRawHTML(url);
    if (html === null) {
        return null;
    }

    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");

    const article = new Readability(document).parse();
    return article ? removeTabNewline(article.textContent) : null;
}
