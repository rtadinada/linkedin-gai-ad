function extractCompanyId(url: string): number {
    const companyPrefix = "https://www.linkedin.com/company/";
    if (!url.startsWith(companyPrefix)) {
        return -1;
    }
    const companyId = url.substring(companyPrefix.length);
    if (!/^\d+$/.test(companyId)) {
        return -1;
    }
    return Number(companyId);
}

export function getAccountId(): number {
    const url = window.location.href;
    const regex = /\/campaignmanager\/accounts\/(\d+)\//;
    const match = url.match(regex);
    if (match) {
        return Number(match[1]);
    }
    return -1;
}

export function getCompanyId(): number {
    const links = document.getElementsByClassName("ads-nav-panel-external-link__link");
    for (let i = 0; i < links.length; i++) {
        const linkUrl = links.item(i)?.getAttribute("href") || "";
        const id = extractCompanyId(linkUrl);
        if (id > 0) {
            return id;
        }
    }
    return -1;
}
